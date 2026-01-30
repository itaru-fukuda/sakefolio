import Link from "next/link"
import { Suspense } from "react"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserMenuFetcher } from "@/components/user-menu-fetcher"
import { Button } from "@/components/ui/button"
import { UserSearch } from "lucide-react"

export function SiteHeader() {
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
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/users/search" aria-label="ユーザー検索">
                                <UserSearch className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Suspense fallback={<Button variant="ghost" size="sm" disabled>...</Button>}>
                            <UserMenuFetcher />
                        </Suspense>
                    </nav>
                </div>
            </div>
        </header>
    )
}
