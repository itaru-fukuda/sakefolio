import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Trophy, Activity } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()

    // Protect Route
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch Stats
    // 1. Total Logs
    const { count: totalLogs } = await supabase
        .from("drink_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

    // 2. Recent Logs (limit 3)
    const { data: recentLogs } = await supabase
        .from("drink_logs")
        .select(`
      *,
      variant:variants(name, brand:brands(name))
    `)
        .eq("user_id", user.id)
        .order("drank_on", { ascending: false })
        .limit(3)

    // 3. Most Drunk Brands (from view)
    const { data: topBrands } = await supabase
        .from("view_user_brand_counts")
        .select(`
      count,
      brand:brands(name)
    `)
        .eq("user_id", user.id)
        .order("count", { ascending: false })
        .limit(5)

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">マイページ</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">総記録数</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLogs || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            件の日本酒を飲みました
                        </p>
                    </CardContent>
                </Card>
                {/* Add more summary cards here if needed */}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Recent Logs */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">最近の記録</h2>
                        <Link href="/app/logs" className="text-sm text-primary hover:underline">
                            すべて見る
                        </Link>
                    </div>
                    {recentLogs && recentLogs.length > 0 ? (
                        <div className="space-y-4">
                            {recentLogs.map((log) => (
                                <Card key={log.id}>
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            {/* @ts-ignore */}
                                            <p className="font-bold">{log.variant?.brand?.name} {log.variant?.name}</p>
                                            <p className="text-xs text-muted-foreground">{log.drank_on} · {log.rating}点</p>
                                        </div>
                                        <Link href="/app/logs">
                                            <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">まだ記録がありません。</p>
                    )}
                </div>

                {/* Top Brands */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        よく飲む銘柄
                    </h2>
                    {topBrands && topBrands.length > 0 ? (
                        <Card>
                            <CardContent className="p-0">
                                <ul className="divide-y">
                                    {/* @ts-ignore */}
                                    {topBrands.map((item: any, index: number) => (
                                        <li key={index} className="flex justify-between p-4">
                                            {/* @ts-ignore */}
                                            <span className="font-medium">{item.brand?.name}</span>
                                            <Badge variant="secondary">{item.count}回</Badge>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-muted-foreground">データが集まるとランキングが表示されます。</p>
                    )}
                </div>
            </div>
        </div>
    )
}
