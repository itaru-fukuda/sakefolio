import { createClient } from "@/lib/supabase/server"
import { getFilteredLogs } from "@/lib/actions/log" // Check import path
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search, Calendar, Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default async function LogsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; min_abv?: string; max_abv?: string; tags?: string }>
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const params = await searchParams

    const minAbv = params.min_abv ? parseFloat(params.min_abv) : undefined
    const maxAbv = params.max_abv ? parseFloat(params.max_abv) : undefined
    const query = params.q
    const tagIds = params.tags?.split(",").map(Number).filter(n => !isNaN(n))

    const logs = await getFilteredLogs(user.id, query, minAbv, maxAbv, tagIds)

    return (
        <div className="container max-w-4xl py-10 px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-serif">飲酒記録一覧</h1>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/logs/search">
                            <Search className="mr-2 h-4 w-4" />
                            検索・絞り込み
                        </Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/logs/new">
                            <Plus className="mr-2 h-4 w-4" />
                            記録する
                        </Link>
                    </Button>
                </div>
            </div>

            {(query || minAbv !== undefined || (tagIds && tagIds.length > 0)) && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        <span className="font-semibold mr-2">検索条件:</span>
                        {query && <span className="mr-3">キーワード "{query}"</span>}
                        {minAbv !== undefined && maxAbv !== undefined && <span className="mr-3">度数 {minAbv}% - {maxAbv}%</span>}
                        {tagIds && tagIds.length > 0 && <span>タグ ({tagIds.length}件)</span>}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/logs" className="text-xs">条件をクリア</Link>
                    </Button>
                </div>
            )}

            <div className="grid gap-4">
                {logs && logs.length > 0 ? (
                    logs.map((log: any) => (
                        <Card key={log.id} className="overflow-hidden hover:bg-muted/30 transition-colors">
                            <div className="flex flex-col sm:flex-row">
                                <div className="p-6 flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {log.drank_on ? format(new Date(log.drank_on), "yyyy/MM/dd") : "-"}
                                        </p>
                                        <div className="flex items-center bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            {log.rating}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold font-serif leading-tight mb-1">
                                            {log.variant.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {log.variant.brand?.name}
                                            <span className="mx-2 text-border">|</span>
                                            {log.variant.brand?.brewery?.name} ({log.variant.brand?.brewery?.prefecture?.name})
                                        </p>
                                    </div>

                                    {log.impression && (
                                        <div className="mt-2 text-sm text-foreground/80 line-clamp-2 bg-muted p-3 rounded-md italic">
                                            "{log.impression}"
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {log.variant.type && (
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {log.variant.type}
                                            </Badge>
                                        )}
                                        {log.variant.abv && (
                                            <Badge variant="outline" className="text-xs font-normal">
                                                Alc. {log.variant.abv}%
                                            </Badge>
                                        )}
                                        {/* Ideally we show matched tags here too if possible, but that requires deeper fetch options */}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-muted-foreground mb-4">記録が見つかりません</p>
                        <Button variant="outline" asChild>
                            <Link href="/logs/new">最初の１杯を記録する</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
