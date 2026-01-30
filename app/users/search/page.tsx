import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { searchUsers } from "@/lib/actions/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Search, User } from "lucide-react"
import { FollowButton } from "@/components/user/follow-button"
import { FormEvent } from "react"

export default async function UserSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const params = await searchParams
    const query = params.q || ""
    const users = query ? await searchUsers(query) : []

    return (
        <div className="container max-w-2xl py-10 px-4 mx-auto">
            <h1 className="text-2xl font-bold font-serif mb-8 text-center">ユーザーを探す</h1>

            <div className="mb-8">
                <form className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="q"
                            placeholder="ユーザー名で検索..."
                            className="pl-9"
                            defaultValue={query}
                        />
                    </div>
                    <Button type="submit">検索</Button>
                </form>
            </div>

            <div className="space-y-4">
                {users.length > 0 ? (
                    users.map((profile) => (
                        <Card key={profile.user_id} className="p-4 hover:bg-muted/50 transition-colors flex flex-row items-center justify-between gap-4">
                            <Link href={`/users/${profile.user_id}`} className="flex items-center gap-4 flex-1 min-w-0">
                                <Avatar className="h-12 w-12 shrink-0">
                                    <AvatarImage src={profile.avatar_url} />
                                    <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                                </Avatar>
                                <div className="truncate">
                                    <p className="font-bold truncate">{profile.display_name || "名無しユーザー"}</p>
                                </div>
                            </Link>
                            {!profile.is_me && (
                                <FollowButton
                                    targetUserId={profile.user_id}
                                    initialIsFollowing={profile.is_following}
                                />
                            )}
                        </Card>
                    ))
                ) : query ? (
                    <div className="text-center py-10 text-muted-foreground">
                        見つかりませんでした
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        キーワードを入力してユーザーを検索してください
                    </div>
                )}
            </div>
        </div>
    )
}
