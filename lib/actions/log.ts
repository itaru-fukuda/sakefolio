"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { DrinkLogSchema } from "@/lib/validations/log"
import { z } from "zod"
import { syncSakeTypes } from "@/lib/actions/sake"

export async function createLog(formData: z.infer<typeof DrinkLogSchema>) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "ログインが必要です" }
    }

    // Update Variant Type if provided and different
    if (formData.type !== undefined && formData.variant_id) {
        // We could verify if it's different to save a write, but simpler to just update.
        // Also sync types
        await syncSakeTypes(formData.type)

        const { error: variantError } = await supabase
            .from("variants")
            .update({ type: formData.type })
            .eq("id", formData.variant_id)

        if (variantError) {
            console.error("Variant Type Update Error", variantError)
            // Should we fail log creation? Probably not, just log error.
        }
    }

    const { error } = await supabase.from("drink_logs").insert({
        user_id: user.id,
        variant_id: formData.variant_id,
        drank_on: formData.drank_on ? formData.drank_on.toISOString() : null,
        rating: formData.rating,
        impression: formData.impression,
        aroma: formData.aroma,
        taste: formData.taste,
        feature: formData.feature,
        texture: formData.texture,
        temperature: formData.temperature,
        is_public: formData.is_public
    })


    if (error) {
        return { error: error.message }
    }

    // Auto-remove from wishlist if exists
    const { error: wishlistError } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("variant_id", formData.variant_id)

    if (wishlistError) {
        // Just log it, don't fail the request
        console.error("Failed to auto-remove from wishlist", wishlistError)
    }

    revalidatePath("/logs")
    redirect("/logs")
}



export async function getFlavorTags(category?: string) {
    const supabase = await createClient()
    let query = supabase.from("sakenowa_flavor_tags").select("id, tag, category").eq("delete_flag", 0).order("id")

    if (category) {
        query = query.eq("category", category)
    }

    const { data } = await query
    return data || []
}

export async function getFilteredLogs(
    userId: string,
    query?: string,
    minAbv?: number,
    maxAbv?: number,
    flavorTagIds?: number[]
) {
    const supabase = await createClient()

    let dbQuery = supabase
        .from("drink_logs")
        .select(`
            id,
            rating,
            impression,
            drank_on,
            variant:variants!inner (
                id,
                name,
                type,
                specific_designation,
                abv,
                brand:brands!inner (
                    id,
                    name,
                    brewery:breweries!inner (
                        id,
                        name,
                        prefecture:prefectures!inner (
                            code,
                            name
                        )
                    )
                    ${flavorTagIds && flavorTagIds.length > 0 ? `, sakenowa_brand_flavor_tags!inner(sakenowa_tag_id)` : ""}
                )
            )
        `)
        .eq("user_id", userId)
        .order("drank_on", { ascending: false })

    // Filter by ABV (using inner join on variants)
    if (minAbv !== undefined) {
        dbQuery = dbQuery.gte("variant.abv", minAbv)
    }
    if (maxAbv !== undefined) {
        dbQuery = dbQuery.lte("variant.abv", maxAbv)
    }

    // Filter by Flavor Tags
    if (flavorTagIds && flavorTagIds.length > 0) {
        // The !inner join on select ensures we only get rows that have matching brand_flavor_tags.
        // But we need to filter specifically for the requested tag IDs.
        // We can use the foreign table filter syntax.
        dbQuery = dbQuery.in("variant.brand.sakenowa_brand_flavor_tags.sakenowa_tag_id", flavorTagIds)
    }

    // Filter by Query (Text Search)
    if (query) {
        // Simple OR search across multiple fields?
        // Supabase doesn't support complex OR across joined tables easily with .or() syntax involving logic.
        // We can search variant name or brand name or impression.
        // Using "textSearch" or "ilike" with or.
        // Format: field.ilike.value,field2.ilike.value
        const q = `%${query}%`
        dbQuery = dbQuery.or(`impression.ilike.${q},aroma.ilike.${q},taste.ilike.${q},variant.name.ilike.${q},variant.brand.name.ilike.${q}`)
    }

    const { data, error } = await dbQuery

    if (error) {
        console.error("Error fetching logs:", error)
        return []
    }

    // Deduplicate?
    // If a brand has multiple matching tags, does Supabase return multiple rows for the same log?
    // No, selects return objects. But the inner join usually filters.
    // If one-to-many, we might get duplicates if we didn't structure it right.
    // drink_logs is the main table. It shouldn't multiply rows unless we join in a way that produces products.
    // But .select() with nested json usually returns unique root rows.

    return data
}

export async function getTimelineLogs(
    currentUserId: string,
    limit: number = 20
) {
    const supabase = await createClient()

    // 1. Get List of Following IDs
    const { data: follows, error: followError } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId)

    if (followError) {
        console.error("Error fetching following:", JSON.stringify(followError, null, 2))
        return []
    }

    const followingIds = follows.map(f => f.following_id)
    const targetUserIds = [...followingIds]

    if (targetUserIds.length === 0) return []

    // 2. Fetch Logs (without joining profiles yet)
    const { data: logs, error } = await supabase
        .from("drink_logs")
        .select(`
            *,
            variant:variants (
                id, name, type, abv,
                brand:brands (
                    id, name,
                    brewery:breweries (
                        id, name,
                        prefecture:prefectures ( code, name )
                    )
                )
            )
        `)
        .in("user_id", targetUserIds)
        .order("drank_on", { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Error fetching timeline logs:", JSON.stringify(error, null, 2))
        return []
    }

    // 3. Fetch Profiles for these logs
    const userIds = Array.from(new Set(logs.map(log => log.user_id)))
    const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds)

    if (profileError) {
        console.error("Error fetching profiles:", JSON.stringify(profileError, null, 2))
        // Continue without profiles if error, or return logs with partial data
    }

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]))

    // 4. Merge
    const logsWithUser = logs.map(log => ({
        ...log,
        user: profileMap.get(log.user_id) || null
    }))

    return logsWithUser
}
