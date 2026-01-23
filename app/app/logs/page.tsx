import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, PencilLine, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function LogsPage() {
    const supabase = await createClient()

    // Protect Route
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch Logs
    const { data: logs } = await supabase
        .from("drink_logs")
        .select(`
      *,
      variant:variants(
        id,
        name,
        brand:brands(name)
      )
    `)
        .eq("user_id", user.id)
        .order("drank_on", { ascending: false })

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">自分の飲酒ログ</h1>
                <Button asChild>
                    <Link href="/app/logs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        新規記録
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {logs && logs.length > 0 ? (
                    logs.map((log) => (
                        <Card key={log.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="h-4 w-4" />
                                            {format(new Date(log.drank_on), "yyyy/MM/dd")}
                                            {log.is_public ? (
                                                <Badge variant="secondary" className="text-xs">公開</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">非公開</Badge>
                                            )}
                                        </div>
                                        {/* @ts-ignore */}
                                        <h3 className="text-xl font-bold">
                                            {/* @ts-ignore */}
                                            {log.variant?.brand?.name} {log.variant?.name}
                                        </h3>
                                        {log.impression && (
                                            <p className="text-muted-foreground">{log.impression}</p>
                                        )}
                                    </div>
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="text-2xl font-bold text-primary">
                                            {log.rating} <span className="text-sm text-muted-foreground font-normal">/ 10</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground mb-4">まだ記録がありません。</p>
                        <Button asChild variant="outline">
                            <Link href="/app/logs/new">はじめての記録をつける</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
