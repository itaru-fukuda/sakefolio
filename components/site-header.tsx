import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export async function SiteHeader() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase
            .from("profiles")
            .select("role, display_name")
            .eq("user_id", user.id)
            .single()
        profile = data
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center gap-4 mx-auto px-4">
                <MobileNav />
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold inline-block">
                        SAKEfolio
                    </span>
                </Link>
                <div className="mr-4 hidden md:flex">
                    <MainNav />
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search Placeholder */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        {user ? (
                            <UserNav user={user} profile={profile} />
                        ) : (
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">
                                    ログイン
                                </Link>
                            </Button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
