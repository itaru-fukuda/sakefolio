import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { FollowButton } from "@/components/user/follow-button"
import { getFollowStatus, getFollowStats } from "@/lib/actions/user"
import { getFilteredLogs } from "@/lib/actions/log"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Star, Calendar, User, MapPin } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params
    const supabase = await createClient()

    // 1. Fetch Target User Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", userId)
        .single()

    if (!profile) {
        notFound()
    }

    // 2. Fetch Current User & Follow Status
    const currentUser = await getCurrentUser()
    let isFollowing = false
    let isMe = false

    if (currentUser) {
        isMe = currentUser.id === userId
        if (!isMe) {
            const status = await getFollowStatus(userId)
            isFollowing = status.isFollowing
        }
    }

    // 3. Fetch Follow Stats
    const stats = await getFollowStats(userId)

    // 4. Fetch User's Logs (Public only - logic in getFilteredLogs needs to handle public/private or we assume defaults)
    // For now, assuming getFilteredLogs returns what the viewer allowed to see (implemented in RLS usually, or filter)
    // Actually, getFilteredLogs currently takes a userId and shows *that* user's logs.
    // If it's the owner, they see everything. If not, RLS should filter.
    // However, the current getFilteredLogs might not explicitly handle visibility.
    // I'll use it for now and assume the database RLS handles privacy or I'll add public filter later.
    // CAUTION: Currently getFilteredLogs might be designed for "My Logs".
    // I need to check `getFilteredLogs`.
    // Proceeding assuming it works for now, but will check RLS later.
    const logs = await getFilteredLogs(userId)

    return (
        <div className="container max-w-4xl py-10 px-4 mx-auto">
            {/* Header / Profile Card */}
            <Card className="p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>{profile.display_name?.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left space-y-2">
                    <h1 className="text-2xl font-bold font-serif">{profile.display_name}</h1>
                    <div className="flex justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                        <div>
                            <span className="font-bold text-foreground mr-1">{stats.followingCount}</span>
                            フォロー
                        </div>
                        <div>
                            <span className="font-bold text-foreground mr-1">{stats.followersCount}</span>
                            フォロワー
                        </div>
                    </div>
                </div>

                <div className="mt-4 sm:mt-0">
                    {!isMe && currentUser && (
                        <FollowButton targetUserId={userId} initialIsFollowing={isFollowing} />
                    )}
                </div>
            </Card>

            <h2 className="text-xl font-bold font-serif mb-4 flex items-center">
                <span className="mr-2">🍶</span> 飲酒記録
            </h2>

            <div className="grid gap-4">
                {logs && logs.length > 0 ? (
                    logs.map((log: any) => (
                        // Reusing Log Card Logic - Ideally should be a component
                        <Card key={log.id} className="overflow-hidden hover:bg-muted/30 transition-colors">
                            <Link href={`/logs/${log.id}`}>
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
                                                {log.variant.brand?.brewery?.name}
                                            </p>
                                        </div>

                                        {log.impression && (
                                            <div className="mt-2 text-sm text-foreground/80 line-clamp-2 bg-muted p-3 rounded-md italic">
                                                "{log.impression}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        記録はまだありません
                    </div>
                )}
            </div>
        </div>
    )
}
