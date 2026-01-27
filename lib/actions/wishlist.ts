"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getWishlist() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch wishlist with variant and brand details
    const { data, error } = await supabase
        .from("wishlists")
        .select(`
            id,
            created_at,
            variant_id,
            variants (
                id,
                name,
                is_active,
                brand_id,
                brands (
                    id,
                    name,
                    kana,
                    brewery_id,
                    breweries (
                        name,
                        prefecture_code,
                        prefectures (name)
                    )
                )
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching wishlist:", error)
        return []
    }

    return data
}

export async function addToWishlist(variantId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("wishlists")
        .insert({
            user_id: user.id,
            variant_id: variantId,
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { success: true, message: "Already in wishlist" }
        }
        console.error("Error adding to wishlist:", error)
        throw new Error("Failed to add to wishlist")
    }

    revalidatePath("/wishlist")
    revalidatePath("/sake") // Assuming sake list might show wishlist status
    return { success: true }
}

export async function removeFromWishlist(variantId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("variant_id", variantId)

    if (error) {
        console.error("Error removing from wishlist:", error)
        throw new Error("Failed to remove from wishlist")
    }

    revalidatePath("/wishlist")
    return { success: true }
}
