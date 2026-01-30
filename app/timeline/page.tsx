import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTimelineLogs } from "@/lib/actions/log"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, Calendar, UserPlus } from "lucide-react"

export default async function TimelinePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const logs = await getTimelineLogs(user.id)

    return (
        <div className="container max-w-2xl py-10 px-4 mx-auto">
            <h1 className="text-2xl font-bold font-serif mb-8 text-center">タイムライン</h1>

            {logs && logs.length > 0 ? (
                <div className="grid gap-6">
                    {logs.map((log: any) => (
                        <Card key={log.id} className="overflow-hidden hover:bg-muted/10 transition-colors">
                            {/* User Header */}
                            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                                <Link href={`/users/${log.user_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={log.user?.avatar_url} />
                                        <AvatarFallback>{log.user?.display_name?.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">
                                        {log.user?.display_name || "ユーザー"}
                                    </span>
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(log.created_at), "M月d日 H:mm")}
                                </span>
                            </div>

                            <Link href={`/variants/${log.variant.id}`} className="block p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h2 className="text-lg font-bold font-serif leading-tight mb-1">
                                            {log.variant.brand?.name}
                                            <span className="text-muted-foreground font-normal ml-1 text-sm">
                                                （{log.variant.name}）
                                            </span>
                                        </h2>
                                    </div>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current text-amber-500" />
                                        {log.rating}
                                    </Badge>
                                </div>

                                {log.impression && (
                                    <p className="text-sm text-foreground/80 line-clamp-3 mb-3">
                                        {log.impression}
                                    </p>
                                )}

                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>飲んだ日: {log.drank_on ? format(new Date(log.drank_on), "yyyy/MM/dd") : "-"}</span>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4">
                    <div className="bg-muted/30 rounded-full p-6 w-fit mx-auto mb-6">
                        <UserPlus className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-bold mb-2">まだタイムラインが空です</h2>
                    <p className="text-muted-foreground mb-6">
                        ユーザーをフォローして、みんなの飲酒記録を見てみましょう！
                    </p>
                    {/* User Search Button */}
                    <Button asChild>
                        <Link href="/users/search">
                            他のユーザーを探す
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
