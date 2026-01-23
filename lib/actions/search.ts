"use server"

import { createClient } from "@/lib/supabase/server"

export type SearchResult = {
    type: "brand" | "brewery"
    id: string
    name: string
    subText?: string | null
}

export async function searchGlobal(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 1) return []

    const supabase = await createClient()

    // Parallel search for brands and breweries
    const [brands, breweries] = await Promise.all([
        supabase
            .from("brands")
            .select("id, name, brewery:breweries(name)")
            .ilike("name", `%${query}%`)
            .limit(5),
        supabase
            .from("breweries")
            .select("id, name, prefecture:prefectures(name)")
            .ilike("name", `%${query}%`)
            .limit(5),
    ])

    const results: SearchResult[] = []

    if (brands.data) {
        brands.data.forEach((brand) => {
            // @ts-ignore
            results.push({
                type: "brand",
                id: brand.id,
                name: brand.name,
                // @ts-ignore
                subText: brand.brewery?.name,
            })
        })
    }

    if (breweries.data) {
        breweries.data.forEach((brewery) => {
            // @ts-ignore
            results.push({
                type: "brewery",
                id: brewery.id,
                name: brewery.name,
                // @ts-ignore
                subText: brewery.prefecture?.name,
            })
        })
    }

    return results
}
