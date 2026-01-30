import { createClient } from "@/lib/supabase/server"
import { getTimelineLogs } from "@/lib/actions/log"
import { getCurrentUser } from "@/lib/auth"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Calendar, ArrowRight, User, UserSearch } from "lucide-react"
import { cn } from "@/lib/utils"

export async function HomeTimeline({ compact = false }: { compact?: boolean }) {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    const logs = await getTimelineLogs(user.id, compact ? 5 : 3)

    if (!logs || logs.length === 0) {
        return (
            <section className={compact ? "w-full" : "mb-12"}>
                <div className={cn("flex items-center justify-between mb-4 border-b border-border pb-2", compact ? "mb-4" : "mb-6 pb-4")}>
                    <h2 className={cn("font-serif font-bold tracking-wide flex items-center gap-2", compact ? "text-lg" : "text-2xl")}>
                        <span className="text-xl">🍶</span> タイムライン
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-center bg-muted/20">
                    <p className="text-muted-foreground mb-4 text-sm">
                        まだタイムラインに表示する投稿がありません。<br />
                        気になるユーザーをフォローしてみましょう！
                    </p>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/users/search" className="flex items-center gap-2">
                            <UserSearch className="h-4 w-4" />
                            ユーザーを探す
                        </Link>
                    </Button>
                </div>
            </section>
        )
    }

    return (
        <section className={compact ? "w-full" : "mb-12"}>
            <div className={cn("flex items-center justify-between mb-4 border-b border-border pb-2", compact ? "mb-4" : "mb-6 pb-4")}>
                <h2 className={cn("font-serif font-bold tracking-wide flex items-center gap-2", compact ? "text-lg" : "text-2xl")}>
                    <span className="text-xl">🍶</span> タイムライン
                </h2>
                <Link href="/timeline" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-serif flex items-center gap-1">
                    もっと見る <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-4">
                {logs.map((log: any) => (
                    <Card key={log.id} className={cn("overflow-hidden hover:bg-muted/30 transition-colors", compact ? "p-3" : "")}>
                        <Link href={`/variants/${log.variant.id}`} className="block">
                            <div className={cn("flex gap-3", compact ? "flex-col items-start" : "p-4 flex-col sm:flex-row gap-4")}>
                                {/* User Info */}
                                <div className={cn("flex items-center gap-2", compact ? "w-full" : "sm:w-48 sm:shrink-0 gap-3")}>
                                    <Avatar className={cn("border border-border", compact ? "h-6 w-6" : "h-10 w-10")}>
                                        <AvatarImage src={log.user?.avatar_url} />
                                        <AvatarFallback><User className={compact ? "h-3 w-3" : "h-5 w-5"} /></AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden flex-1 flex items-baseline justify-between">
                                        <p className="font-bold text-sm truncate mr-2">{log.user?.display_name || "ユーザー"}</p>
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {log.drank_on ? format(new Date(log.drank_on), "M/d") : "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="min-w-0 flex-1 mr-2">
                                            <h3 className={cn("font-bold font-serif leading-tight truncate", compact ? "text-base" : "text-lg")}>
                                                {log.variant.brand?.name}
                                                <span className="text-muted-foreground font-normal ml-1 text-sm">
                                                    （{log.variant.name}）
                                                </span>
                                            </h3>
                                        </div>
                                        <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0 shrink-0">
                                            <Star className="w-3 h-3 fill-current text-amber-500" />
                                            {log.rating}
                                        </Badge>
                                    </div>

                                    {log.impression && !compact && (
                                        <p className="text-sm text-foreground/80 line-clamp-2 mt-2">
                                            {log.impression}
                                        </p>
                                    )}
                                    {log.impression && compact && (
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                            {log.impression}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>
        </section>
    )
}
