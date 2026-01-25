"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled more than 300px
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)

        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <Button
            size="icon"
            className={cn(
                "fixed bottom-8 right-8 z-50 rounded-full shadow-lg transition-all duration-300 opacity-0 translate-y-10",
                isVisible && "opacity-100 translate-y-0"
            )}
            onClick={scrollToTop}
            aria-label="ページトップへ戻る"
        >
            <ArrowUp className="h-4 w-4" />
        </Button>
    )
}
