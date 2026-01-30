"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function GlobalLoaderProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = React.useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Reset loading when path changes
    React.useEffect(() => {
        setIsLoading(false)
    }, [pathname, searchParams])

    // Intercept link clicks
    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a")
            if (!target) return

            const href = target.getAttribute("href")
            if (!href) return

            // Ignore external links, new tabs, etc.
            if (
                target.target === "_blank" ||
                e.altKey ||
                e.ctrlKey ||
                e.metaKey ||
                e.shiftKey
            ) {
                return
            }

            // Ignore hash links on same page
            if (href.startsWith("#")) return

            // Check if it's an internal navigation
            if (href.startsWith("/") || href.startsWith(window.location.origin)) {
                // If navigating to same page, don't show loader? maybe yes if it reloads data
                if (href === window.location.pathname) {
                    // Optional: check query params difference
                }
                setIsLoading(true)
            }
        }

        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [])

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <LoadingSpinner className="h-12 w-12 text-primary" />
                </div>
            )}
            {children}
        </>
    )
}
