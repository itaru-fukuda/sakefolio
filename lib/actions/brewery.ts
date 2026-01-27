"use server"

import { createClient } from "@/lib/supabase/server"

export type BrewerySearchResult = {
    id: string
    name: string
    prefecture: {
        code: string
        name: string
    } | null
}

export type BrewerySearchResponse = {
    data: BrewerySearchResult[]
    totalCount: number
}

export async function searchBreweries(
    query?: string,
    prefectureCode?: string,
    page: number = 1,
    limit: number = 20
): Promise<BrewerySearchResponse> {
    const supabase = await createClient()

    let dbQuery = supabase
        .from("breweries")
        .select(`
            id,
            name,
            prefecture:prefectures!inner (
                code,
                name
            )
        `, { count: 'exact' })

    // Filter by Prefecture
    if (prefectureCode && prefectureCode !== "all") {
        dbQuery = dbQuery.eq("prefecture.code", prefectureCode)
    }

    // Filter by Query (Name)
    if (query) {
        const q = `%${query}%`
        dbQuery = dbQuery.ilike("name", q)
    }

    // Default sorting
    dbQuery = dbQuery.order("id", { ascending: true })

    // Apply Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await dbQuery.range(from, to)

    if (error) {
        console.error("Brewery Search Error", error)
        return { data: [], totalCount: 0 }
    }

    const formattedData = data.map((b: any) => ({
        id: b.id,
        name: b.name,
        prefecture: b.prefecture
    }))

    return {
        data: formattedData,
        totalCount: count || 0
    }
}
