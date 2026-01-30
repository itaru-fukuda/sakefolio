import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function UserMenuFetcher() {
    const user = await getCurrentUser()

    if (!user) {
        return (
            <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                    ログイン
                </Link>
            </Button>
        )
    }

    const supabase = await createClient()
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, display_name, avatar_url")
        .eq("user_id", user.id)
        .single()

    return <UserNav user={user} profile={profile} />
}
