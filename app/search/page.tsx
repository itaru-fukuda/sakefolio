import { getFlavorTags } from "@/lib/actions/log"
import { searchSakeDatabase, type SakeSearchResult } from "@/lib/actions/search"
import { SakeSearchForm } from "@/components/sake/sake-search-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

import { MapPin, Building2, Ticket, Filter } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { SearchPagination } from "@/components/sake/search-pagination"
import { WishlistAddButton } from "@/components/wishlist/wishlist-add-button"

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; tags?: string; page?: string }>
}) {
    const availableTags = await getFlavorTags()
    const params = await searchParams

    const query = params.q
    const tagIds = params.tags?.split(",").map(Number).filter(n => !isNaN(n))

    // Pagination
    const page = Number(params.page) || 1
    const limit = 20

    const hasParams = query || (tagIds && tagIds.length > 0)

    // Fetch data with pagination
    // Default to empty if no params? Or allow browsing? 
    // Let's allow browsing if no params for database discovery.
    // If no params, hasParams is false.
    // User requested "Search results when many", implies browsing.
    // Let's call search if hasParams OR just call it always but empty query?
    // Previously: hasParams ? await ... : []
    // Let's change this to ALWAYS search if user wants to see all database?
    // But "Search Results" title might be confusing if just listing all.
    // For now, keep existing behavior: only search if params exist.

    // Actually, if pagination is requested, user probably expects results.
    // Let's call search if hasParams is true.

    const { data: results, totalCount } = hasParams
        ? await searchSakeDatabase(query, tagIds, page, limit)
        : { data: [], totalCount: 0 }

    const totalPages = Math.ceil(totalCount / limit)

    return (
        <div className="container py-12 px-4 mx-auto max-w-5xl">
            {/* Header ... */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold font-serif mb-4">日本酒データベース検索</h1>
                <p className="text-muted-foreground">
                    全国の銘柄・酒蔵から、<br className="md:hidden" />
                    あなた好みの日本酒を探しましょう。<br />
                    気になったお酒は、その場で<br className="md:hidden" />
                    「飲みたいリスト」に登録できます。
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Mobile Filter Trigger */}
                <div className="md:hidden mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                検索条件を変更
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[85vw] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>検索条件</SheetTitle>
                                <SheetDescription>
                                    詳細条件を指定して絞り込みます。
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4">
                                <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                                    <SakeSearchForm availableTags={availableTags} />
                                </Suspense>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Sidebar: Search Form (Desktop) */}
                <div className="hidden md:block md:col-span-4">
                    <SakeSearchForm availableTags={availableTags} />
                </div>

                {/* Main Content: Results */}
                <div className="md:col-span-8">
                    <h2 className="text-xl font-bold font-serif mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <SearchIconHeader />
                            検索結果
                            {hasParams && <span className="ml-2 text-sm font-normal text-muted-foreground">({totalCount}件)</span>}
                        </div>
                    </h2>

                    <div className="space-y-4">
                        {results.length > 0 ? (
                            <>
                                {results.map((sake: SakeSearchResult) => (
                                    <Card key={sake.variant_id} className="hover:bg-muted/30 transition-colors">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="p-6 flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold font-serif mb-1">{sake.brand_name}</h3>
                                                        <div className="text-sm text-foreground/80 font-medium mb-1">
                                                            {sake.variant_name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-2">
                                                            <span className="flex items-center">
                                                                <Building2 className="w-3 h-3 mr-1" />
                                                                {sake.brewery_name}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <MapPin className="w-3 h-3 mr-1" />
                                                                {sake.prefecture_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {sake.variant_type && (
                                                        <Badge variant="secondary" className="mr-2 text-xs font-normal">
                                                            {sake.variant_type}
                                                        </Badge>
                                                    )}
                                                    {sake.abv && (
                                                        <Badge variant="outline">Alc. {sake.abv}%</Badge>
                                                    )}
                                                </div>

                                                {sake.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {sake.tags.map((tag, i) => (
                                                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                                                    <WishlistAddButton variantId={sake.variant_id} />
                                                    <Button size="sm" asChild>
                                                        <Link href={`/logs/new?variant_id=${sake.variant_id}`}>
                                                            <Ticket className="w-4 h-4 mr-2" />
                                                            飲んだ！ (記録)
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <SearchPagination currentPage={page} totalPages={totalPages} />
                            </>
                        ) : (
                            <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-muted-foreground">
                                    {hasParams ? "条件に一致する日本酒は見つかりませんでした" : "検索条件を入力して検索してください"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function SearchIconHeader() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-2"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
