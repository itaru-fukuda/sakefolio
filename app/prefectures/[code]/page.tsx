import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageProps {
    params: Promise<{ code: string }>
}

export default async function PrefecturePage({ params }: PageProps) {
    const { code } = await params
    const supabase = await createClient()

    // Fetch Prefecture Name
    const { data: prefecture } = await supabase
        .from("prefectures")
        .select("name")
        .eq("code", code)
        .single()

    if (!prefecture) {
        notFound()
    }

    // Fetch Breweries
    const { data: breweries } = await supabase
        .from("breweries")
        .select("*")
        .eq("prefecture_code", code)
        .order("name")

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href="/prefectures" className="flex items-center text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        都道府県一覧に戻る
                    </Link>
                </Button>
            </div>

            <h1 className="mb-8 text-3xl font-bold">{prefecture.name}の酒蔵</h1>

            {breweries && breweries.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {breweries.map((brewery) => (
                        <Link key={brewery.id} href={`/breweries/${brewery.id}`}>
                            <Card className="h-full transition-all hover:shadow-md">
                                <CardHeader>
                                    <CardTitle>{brewery.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-3">
                                        {brewery.description || "説明コメントなし"}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    この都道府県にはまだ登録された酒蔵がありません。
                </div>
            )}
        </div>
    )
}
