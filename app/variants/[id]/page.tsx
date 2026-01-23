import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PencilLine, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress" // I might need to install progress or use div

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function VariantPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch Variant
    const { data: variant } = await supabase
        .from("variants")
        .select(`
      *,
      brand:brands(id, name, brewery_id),
      variant_tags(tag:tags(id, name))
    `)
        .eq("id", id)
        .single()

    if (!variant) {
        notFound()
    }

    // Fetch Pro Ratings
    const { data: proRatings } = await supabase
        .from("pro_ratings")
        .select(`
      *,
      source:rating_sources(name)
    `)
        .eq("variant_id", id)

    // Fetch Public Stats
    const { data: publicStats } = await supabase
        .from("view_user_variant_rating_avg")
        .select("avg_rating")
        .eq("variant_id", id)
        .single() // Might be null if no data

    // Fetch My Stats if logged in
    let myStats = null
    if (user) {
        const { data } = await supabase
            .from("view_user_variant_rating_avg")
            .select("avg_rating")
            .eq("variant_id", id)
            .eq("user_id", user.id)
            .single()
        myStats = data
    }

    // Calculate normalized scores
    const normalizedProRatings = proRatings?.map(r => {
        let normalized = null
        if (r.score_max) {
            normalized = (r.score / r.score_max) * 10
        }
        return { ...r, normalized }
    })

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    {/* @ts-ignore */}
                    <Link href={`/brands/${variant.brand?.id}`} className="flex items-center text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {/* @ts-ignore */}
                        {variant.brand?.name}に戻る
                    </Link>
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left: Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        {/* @ts-ignore */}
                        <h2 className="text-xl text-muted-foreground mb-1">{variant.brand?.name}</h2>
                        <h1 className="text-4xl font-bold mb-4">{variant.name}</h1>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {/* @ts-ignore */}
                            {variant.variant_tags?.map(({ tag }) => (
                                <Badge key={tag.id} variant="secondary">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>スペック</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">アルコール度数</p>
                                    <p className="font-medium">{variant.abv ? `${variant.abv}%` : "不明"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">精米歩合</p>
                                    <p className="font-medium">{variant.rice_polishing_ratio ? `${variant.rice_polishing_ratio}%` : "不明"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">メモ</p>
                                    <p className="whitespace-pre-wrap">{variant.notes || "なし"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pro Ratings */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">プロ評価</h3>
                        {normalizedProRatings && normalizedProRatings.length > 0 ? (
                            <div className="space-y-4">
                                {normalizedProRatings.map((rating) => (
                                    <Card key={rating.id}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                {/* @ts-ignore */}
                                                <p className="font-bold">{rating.source?.name}</p>
                                                <p className="text-xs text-muted-foreground">{rating.published_at}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">
                                                    {rating.normalized ? rating.normalized.toFixed(1) : "-"}
                                                    <span className="text-sm text-muted-foreground font-normal"> / 10</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    (元スコア: {rating.score} / {rating.score_max || "?"})
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">プロ評価はまだ登録されていません。</p>
                        )}
                    </div>
                </div>

                {/* Right: Stats & Action */}
                <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 fill-primary text-primary" />
                                評価スコア
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">あなたの平均評価</p>
                                <div className="text-3xl font-bold">
                                    {myStats?.avg_rating ? Number(myStats.avg_rating).toFixed(1) : "-"}
                                    <span className="text-sm text-muted-foreground font-normal"> / 10</span>
                                </div>
                                {!user && <p className="text-xs text-muted-foreground mt-1">ログインすると表示されます</p>}
                            </div>

                            <div className="pt-4 border-t border-primary/20">
                                <p className="text-sm text-muted-foreground mb-1">全ユーザー平均</p>
                                <div className="text-2xl font-semibold text-muted-foreground">
                                    {publicStats?.avg_rating ? Number(publicStats.avg_rating).toFixed(1) : "-"}
                                    <span className="text-sm font-normal"> / 10</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {user ? (
                                <Button className="w-full" asChild>
                                    <Link href={`/app/logs/new?variant_id=${variant.id}`}>
                                        <PencilLine className="mr-2 h-4 w-4" />
                                        飲んだ！ (記録する)
                                    </Link>
                                </Button>
                            ) : (
                                <Button className="w-full" asChild variant="secondary">
                                    <Link href="/login">
                                        ログインして記録する
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
