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


export type SakeSearchResult = {
    variant_id: string
    variant_name: string
    variant_type?: string | null
    abv: number | null
    brand_id: string
    brand_name: string
    brewery_name: string
    prefecture_name: string
    tags: string[]
}

export type SakeSearchResponse = {
    data: SakeSearchResult[]
    totalCount: number
}

// ...

export async function searchSakeDatabase(
    query?: string,
    flavorTagIds?: number[],
    page: number = 1,
    limit: number = 20
): Promise<SakeSearchResponse> {
    const supabase = await createClient()

    let validBrandIds: string[] | null = null

    if (flavorTagIds && flavorTagIds.length > 0) {
        // AND Logic: Find Brand IDs that have ALL the specified tags
        const { data: tagMatches, error: tagError } = await supabase
            .from("sakenowa_brand_flavor_tags")
            .select("brand_id, sakenowa_tag_id")
            .in("sakenowa_tag_id", flavorTagIds)

        if (tagError) {
            console.error("Tag Match Error", tagError)
            return { data: [], totalCount: 0 }
        }

        if (!tagMatches || tagMatches.length === 0) {
            return { data: [], totalCount: 0 } // No brands match ANY
        }

        const brandCounts = new Map<string, number>()
        tagMatches.forEach(row => {
            const current = brandCounts.get(row.brand_id) || 0
            brandCounts.set(row.brand_id, current + 1)
        })

        const uniqueRequestedTags = new Set(flavorTagIds).size
        const matchedIds: string[] = []
        brandCounts.forEach((count, brandId) => {
            if (count === uniqueRequestedTags) {
                matchedIds.push(brandId)
            }
        })

        if (matchedIds.length === 0) {
            return { data: [], totalCount: 0 } // No brands match ALL
        }

        validBrandIds = matchedIds
    }

    let dbQuery = supabase
        .from("variants")
        .select(`
            id,
            name,
            type,
            abv,
            brand:brands!inner (
                id,
                name,
                brewery:breweries!inner (
                    name,
                    prefecture:prefectures!inner (
                        name
                    )
                ),
                sakenowa_brand_flavor_tags (
                    tag:sakenowa_flavor_tags (
                        tag
                    )
                )
            )
        `, { count: 'exact' }) // Request total count
        .eq("is_active", true)

    if (validBrandIds !== null) {
        dbQuery = dbQuery.in("brand_id", validBrandIds)
    }

    if (query) {
        // Step 1: Find brands that match the query
        const { data: matchedBrands } = await supabase
            .from("brands")
            .select("id")
            .ilike("name", `%${query}%`)
            .limit(100) // Limit to avoid massive ID lists

        const matchedBrandIds = matchedBrands?.map(b => b.id) || []
        const q = `%${query}%`

        // Step 2: Build OR condition
        // variant.name matches OR variant.brand_id is in matchedBrandIds
        let orCondition = `name.ilike.${q}`
        if (matchedBrandIds.length > 0) {
            orCondition += `,brand_id.in.(${matchedBrandIds.join(",")})`
        }

        dbQuery = dbQuery.or(orCondition)
    }

    // Apply Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await dbQuery.range(from, to)

    if (error) {
        console.error("Search Error", error)
        return { data: [], totalCount: 0 }
    }

    const formattedData = data.map((v: any) => ({
        variant_id: v.id,
        variant_name: v.name,
        variant_type: v.type,
        abv: v.abv,
        brand_id: v.brand?.id,
        brand_name: v.brand?.name,
        brewery_name: v.brand?.brewery?.name,
        prefecture_name: v.brand?.brewery?.prefecture?.name,
        tags: v.brand?.sakenowa_brand_flavor_tags?.map((t: any) => t.tag?.tag).filter(Boolean) || []
    }))

    return {
        data: formattedData,
        totalCount: count || 0
    }
}
