import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BreweryPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: brewery } = await supabase
        .from("breweries")
        .select(`
      *,
      prefecture:prefectures(name, code)
    `)
        .eq("id", id)
        .single()

    if (!brewery) {
        notFound()
    }

    // Fetch Brands
    const { data: brands } = await supabase
        .from("brands")
        .select("*")
        .eq("brewery_id", id)
        .order("name")

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    {/* @ts-ignore - Supabase type for foreign key might be array or single depending on relationship setup, assuming single here */}
                    <Link href={`/prefectures/${brewery.prefecture?.code}`} className="flex items-center text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {/* @ts-ignore */}
                        {brewery.prefecture?.name}の酒蔵一覧に戻る
                    </Link>
                </Button>
            </div>

            <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold">{brewery.name}</h1>
                    {brewery.website_url && (
                        <a
                            href={brewery.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <ExternalLink className="h-5 w-5" />
                        </a>
                    )}
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap max-w-2xl">
                    {brewery.description}
                </p>
            </div>

            <h2 className="mb-6 text-2xl font-semibold">銘柄一覧</h2>

            {brands && brands.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {brands.map((brand) => (
                        <Link key={brand.id} href={`/brands/${brand.id}`}>
                            <Card className="h-full transition-all hover:shadow-md">
                                <CardHeader>
                                    <CardTitle>{brand.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {brand.description || "説明なし"}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    登録されている銘柄がありません。
                </div>
            )}
        </div>
    )
}
