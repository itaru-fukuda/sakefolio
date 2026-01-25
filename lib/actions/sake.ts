"use server"

import { createClient } from "@/lib/supabase/server"
import { SakeRegistrationSchema } from "@/lib/validations/sake"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getSakeTypes() {
    const supabase = await createClient()
    const { data } = await supabase
        .from("sake_types")
        .select("name")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true })
    // Return string array for easier consumption
    return data?.map((d) => d.name) || []
}

export async function syncSakeTypes(typeString?: string | null) {
    if (!typeString) return

    // split by space (full-width or half-width)
    const tokens = typeString.split(/[\s　]+/).filter(Boolean)
    if (tokens.length === 0) return

    const supabase = await createClient()

    // We want to insert ignore.
    // Supabase JS doesn't support "insert ignore" easily for batch in one go without UPSERT with ON CONFLICT.
    // But 'name' is unique.

    // Attempt to insert all, ignoring conflicts.
    const { error } = await supabase
        .from("sake_types")
        .upsert(
            tokens.map((t) => ({ name: t })),
            { onConflict: "name", ignoreDuplicates: true }
        )

    if (error) {
        console.error("Failed to sync sake types:", error)
        // Don't block the main action though
    }
}

export async function createCustomSake(
    data: z.infer<typeof SakeRegistrationSchema>
) {
    const supabase = await createClient()

    // 1. Auth Check
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "ログインが必要です。" }
    }

    // 2. Validate Inputs
    const validatedFields = SakeRegistrationSchema.safeParse(data)

    if (!validatedFields.success) {
        return { error: "入力内容に誤りがあります。" }
    }

    const {
        breweryName,
        prefectureCode,
        brandName,
        variantName,
        type,
        abv
    } = validatedFields.data

    // Sync types asynchronously? Or await? Await is safer to ensure it exists for next time.
    await syncSakeTypes(type)

    try {
        // 3. Brewery Logic
        // Check if brewery exists by name
        let breweryId: string | null = null

        const { data: existingBrewery } = await supabase
            .from("breweries")
            .select("id")
            .eq("name", breweryName)
            .single()

        if (existingBrewery) {
            breweryId = existingBrewery.id
        } else {
            // Create new brewery
            if (!prefectureCode) {
                return { error: "新しい酒蔵を登録する場合は、都道府県を選択してください。" }
            }

            const { data: newBrewery, error: breweryError } = await supabase
                .from("breweries")
                .insert({
                    name: breweryName,
                    prefecture_code: prefectureCode,
                })
                .select("id")
                .single()

            if (breweryError) {
                console.error("Brewery Create Error", breweryError)
                return { error: "酒蔵の登録に失敗しました。" }
            }
            breweryId = newBrewery.id
        }

        // 4. Brand Logic
        let brandId: string | null = null

        const { data: existingBrand } = await supabase
            .from("brands")
            .select("id")
            .eq("name", brandName)
            .eq("brewery_id", breweryId)
            .single()

        if (existingBrand) {
            brandId = existingBrand.id
        } else {
            // Create new brand
            const { data: newBrand, error: brandError } = await supabase
                .from("brands")
                .insert({
                    name: brandName,
                    brewery_id: breweryId,
                })
                .select("id")
                .single()

            if (brandError) {
                console.error("Brand Create Error", brandError)
                return { error: "銘柄の登録に失敗しました。" }
            }
            brandId = newBrand.id
        }

        // 5. Variant Logic
        // Always create new variant if it doesn't exist? Or check specific name?
        // Let's check if this variant name already exists for this brand.
        let variantId: string | null = null

        const { data: existingVariant } = await supabase
            .from("variants")
            .select("id")
            .eq("name", variantName)
            .eq("brand_id", brandId)
            .single()

        if (existingVariant) {
            variantId = existingVariant.id
            // If it already exists, just return it (Success, effectively "selected" it)
        } else {
            const { data: newVariant, error: variantError } = await supabase
                .from("variants")
                .insert({
                    name: variantName,
                    brand_id: brandId,
                    type: validatedFields.data.type,
                    abv: validatedFields.data.abv,
                    is_active: true
                })
                .select("id")
                .single()

            if (variantError) {
                console.error("Variant Create Error", variantError)
                return { error: "種類の登録に失敗しました。" }
            }
            variantId = newVariant.id
        }

        revalidatePath("/logs/new") // Revalidate to refresh lists if they are fetched server-side
        return { success: true, variantId: variantId }

    } catch (error) {
        console.error("Custom Sake Create Error", error)
        return { error: "登録中にエラーが発生しました。" }
    }
}
