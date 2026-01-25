"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SearchPaginationProps {
    currentPage: number
    totalPages: number
}

export function SearchPagination({ currentPage, totalPages }: SearchPaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNumber.toString())
        return `?${params.toString()}`
    }

    const goToPage = (page: number) => {
        router.push(createPageURL(page))
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                前へ
            </Button>
            <span className="text-sm text-muted-foreground font-mono">
                {currentPage} / {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                次へ
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}
