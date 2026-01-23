"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                ホーム
            </Link>
            <Link
                href="/prefectures"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                都道府県
            </Link>
        </nav>
    )
}
