import { Suspense } from "react"
import { getWishlist, removeFromWishlist } from "@/lib/actions/wishlist"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Trash, Wine } from "lucide-react"
import Link from "next/link"
import { WishlistRemoveButton } from "@/components/wishlist/wishlist-remove-button"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
    const wishlist = await getWishlist()

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-primary">飲みたいリスト</h1>
                    <p className="text-muted-foreground mt-2">
                        気になっているお酒をリスト管理できます。
                        <br />
                        飲んだ記録（ログ）を作成すると、自動的にリストから削除されます。
                    </p>
                </div>
            </header>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <Wine className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">リストは空です</h3>
                    <p className="text-muted-foreground mb-6">
                        詳細検索から気になるお酒を探して登録してみましょう。
                    </p>
                    <Link href="/search">
                        <Button>詳細検索へ</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item: any) => {
                        const variant = item.variants
                        const brand = variant?.brands
                        const brewery = brand?.breweries
                        const prefecture = brewery?.prefectures

                        return (
                            <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="text-xs text-muted-foreground">
                                            {prefecture?.name} | {brewery?.name}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-serif">
                                        {brand?.name} {variant?.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-sm text-muted-foreground mb-2">
                                        {brand?.kana && <p>{brand.kana}</p>}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {/* Tags could be displayed here if fetched */}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        登録日: {new Date(item.created_at).toLocaleDateString()}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 flex gap-2">
                                    <Link href={`/logs/new?variant_id=${variant?.id}`} className="flex-1">
                                        <Button className="w-full" variant="default" size="sm">
                                            ログ作成
                                        </Button>
                                    </Link>
                                    <WishlistRemoveButton variantId={variant?.id} />
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
