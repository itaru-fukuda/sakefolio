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
    prefectureCodes?: string[] | string,
    page: number = 1,
    limit: number = 20
): Promise<BrewerySearchResponse> {
    const supabase = await createClient()

    // Optimization: If no query and no prefectures, return empty
    // unless you want to show "All" by default. User requested "No initial load".
    const hasQuery = query && query.trim().length > 0
    const hasPrefectures = Array.isArray(prefectureCodes)
        ? prefectureCodes.length > 0
        : prefectureCodes && prefectureCodes !== "all" && prefectureCodes.length > 0

    if (!hasQuery && !hasPrefectures) {
        return { data: [], totalCount: 0 }
    }

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

    // Filter by Prefecture (Multi-select)
    if (hasPrefectures) {
        let codes: string[] = []
        if (Array.isArray(prefectureCodes)) {
            codes = prefectureCodes
        } else if (typeof prefectureCodes === "string") {
            // Handle comma-separated string or single value
            codes = prefectureCodes.split(",").filter(c => c !== "all" && c.trim().length > 0)
        }

        if (codes.length > 0) {
            dbQuery = dbQuery.in("prefecture.code", codes)
        }
    }

    // Filter by Query (Name)
    if (hasQuery) {
        const q = `%${query}%`
        dbQuery = dbQuery.ilike("name", q)
    }

    // Only show active breweries
    dbQuery = dbQuery.eq("is_active", true)

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
