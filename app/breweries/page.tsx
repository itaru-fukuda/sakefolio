import { createClient } from "@/lib/supabase/server"
import { searchBreweries, BrewerySearchResult } from "@/lib/actions/brewery"
import { BrewerySearchForm } from "@/components/breweries/brewery-search-form"
import { SearchPagination } from "@/components/sake/search-pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Building2, Filter, Search } from "lucide-react"
import { Suspense } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export const dynamic = "force-dynamic"

export default async function BreweriesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; pref?: string; page?: string }>
}) {
    // 1. Fetch Prefectures for the form
    const supabase = await createClient()
    const { data: prefectures } = await supabase
        .from("prefectures")
        .select("code, name")
        .order("code", { ascending: true })

    const params = await searchParams
    const query = params.q
    // Support multiple prefectures comma separated
    const prefectureCodes = params.pref ? params.pref.split(",") : undefined
    const page = Number(params.page) || 1
    const limit = 20

    // 2. Fetch Breweries
    const { data: breweries, totalCount } = await searchBreweries(query, prefectureCodes, page, limit)

    const totalPages = Math.ceil(totalCount / limit)

    // Check if initial load (no params)
    const isInitial = !query && (!prefectureCodes || prefectureCodes.length === 0)

    return (
        <div className="container py-12 px-4 mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold font-serif mb-4">酒造から探す</h1>
                <p className="text-muted-foreground">
                    全国の酒造を検索できます。<br />
                    お気に入りの酒造を見つけて、その銘柄をチェックしましょう。
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
                                    <BrewerySearchForm prefectures={prefectures || []} />
                                </Suspense>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Sidebar: Search Form (Desktop) */}
                <div className="hidden md:block md:col-span-4">
                    <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                        <BrewerySearchForm prefectures={prefectures || []} />
                    </Suspense>
                </div>

                {/* Main Content: Results */}
                <div className="md:col-span-8">
                    <h2 className="text-xl font-bold font-serif mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <Building2 className="w-5 h-5 mr-2" />
                            検索結果
                            <span className="ml-2 text-sm font-normal text-muted-foreground">({totalCount}件)</span>
                        </div>
                    </h2>

                    <div className="space-y-4">
                        {isInitial ? (
                            <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                                <Search className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-bold mb-2">検索条件を入力してください</h3>
                                <p className="text-muted-foreground">
                                    左側のフォームからキーワードや都道府県を指定して検索してください。
                                </p>
                            </div>
                        ) : breweries.length > 0 ? (
                            <>
                                {breweries.map((brewery: BrewerySearchResult) => (
                                    <Link href={`/breweries/${brewery.id}`} key={brewery.id} className="block group">
                                        <Card className="hover:bg-muted/30 transition-colors h-full">
                                            <CardContent className="p-6 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold font-serif mb-1 group-hover:text-primary transition-colors">
                                                        {brewery.name}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-foreground/80">
                                                        <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                                                        {brewery.prefecture?.name || "都道府県不明"}
                                                    </div>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {/* Right arrow or something? */}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}

                                <SearchPagination currentPage={page} totalPages={totalPages} />
                            </>
                        ) : (
                            <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-muted-foreground">
                                    条件に一致する酒造は見つかりませんでした
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
