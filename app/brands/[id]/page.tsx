import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BrandPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Brand with Brewery and Tags
    const { data: brand } = await supabase
        .from("brands")
        .select(`
      *,
      brewery:breweries(id, name),
      brand_tags(tag:tags(id, name))
    `)
        .eq("id", id)
        .single()

    if (!brand) {
        notFound()
    }

    // Fetch Variants
    const { data: variants } = await supabase
        .from("variants")
        .select(`
      *,
      variant_tags(tag:tags(id, name))
    `)
        .eq("brand_id", id)
        .eq("is_active", true)
        .order("name")

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    {/* @ts-ignore */}
                    <Link href={`/breweries/${brand.brewery?.id}`} className="flex items-center text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {/* @ts-ignore */}
                        {brand.brewery?.name}に戻る
                    </Link>
                </Button>
            </div>

            <div className="mb-10">
                <h1 className="mb-2 text-3xl font-bold">{brand.name}</h1>
                <p className="mb-4 text-muted-foreground">{brand.description}</p>

                {/* @ts-ignore */}
                {brand.brand_tags && brand.brand_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {/* @ts-ignore */}
                        {brand.brand_tags.map(({ tag }) => (
                            <Badge key={tag.id} variant="secondary">
                                <Tag className="mr-1 h-3 w-3" />
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <h2 className="mb-6 text-2xl font-semibold">ラインナップ</h2>

            {variants && variants.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {variants.map((variant) => (
                        <Link key={variant.id} href={`/variants/${variant.id}`}>
                            <Card className="h-full transition-all hover:shadow-md">
                                <CardHeader>
                                    <CardTitle>{variant.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {variant.abv && <p>アルコール度数: {variant.abv}%</p>}
                                        {variant.rice_polishing_ratio && <p>精米歩合: {variant.rice_polishing_ratio}%</p>}
                                    </div>

                                    {/* @ts-ignore */}
                                    {variant.variant_tags && variant.variant_tags.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-1">
                                            {/* @ts-ignore */}
                                            {variant.variant_tags.map(({ tag }) => (
                                                <Badge key={tag.id} variant="outline" className="text-xs">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    登録されているラインナップがありません。
                </div>
            )}
        </div>
    )
}
