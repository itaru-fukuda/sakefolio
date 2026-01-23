"use server"

import { createClient } from "@/lib/supabase/server"

interface CSVRow {
    variant_name: string
    brand_name: string
    brewery_name: string
    prefecture_name: string
    source_name: string
    score: string
    score_max: string
    reference_url: string
    published_at: string
    note: string
}

export async function importProRatings(rows: CSVRow[]) {
    const supabase = await createClient()

    // Check Admin Again (Security)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()
    if (profile?.role !== "admin") return { error: "Unauthorized" }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const row of rows) {
        try {
            // 1. Prefecture (Lookup only, assuming standard names)
            // For simplicity, we skip prefecture lookup/creation if we just need it for Brewery creation
            // We assume strict naming or we search.
            // Let's search prefecture code by name.
            const { data: pref } = await supabase.from("prefectures").select("code").eq("name", row.prefecture_name).single()
            const prefCode = pref?.code || null // If not found, brewery might fail or strictly required.

            // 2. Brewery (Upsert)
            // Check existing
            let breweryId: string
            const { data: existingBrewery } = await supabase.from("breweries").select("id").eq("name", row.brewery_name).single()
            if (existingBrewery) {
                breweryId = existingBrewery.id
            } else {
                if (!prefCode) throw new Error(`Prefecture not found: ${row.prefecture_name}`)
                const { data: newBrewery, error: bError } = await supabase.from("breweries").insert({
                    name: row.brewery_name,
                    prefecture_code: prefCode
                }).select("id").single()
                if (bError) throw bError
                breweryId = newBrewery.id
            }

            // 3. Brand (Upsert)
            let brandId: string
            const { data: existingBrand } = await supabase.from("brands").select("id").eq("name", row.brand_name).eq("brewery_id", breweryId).single()
            if (existingBrand) {
                brandId = existingBrand.id
            } else {
                const { data: newBrand, error: brError } = await supabase.from("brands").insert({
                    name: row.brand_name,
                    brewery_id: breweryId
                }).select("id").single()
                if (brError) throw brError
                brandId = newBrand.id
            }

            // 4. Variant (Upsert)
            let variantId: string
            const { data: existingVariant } = await supabase.from("variants").select("id").eq("name", row.variant_name).eq("brand_id", brandId).single()
            if (existingVariant) {
                variantId = existingVariant.id
            } else {
                const { data: newVariant, error: vError } = await supabase.from("variants").insert({
                    name: row.variant_name,
                    brand_id: brandId
                }).select("id").single()
                if (vError) throw vError
                variantId = newVariant.id
            }

            // 5. Source (Upsert)
            let sourceId: string
            const { data: existingSource } = await supabase.from("rating_sources").select("id").eq("name", row.source_name).single()
            if (existingSource) {
                sourceId = existingSource.id
            } else {
                const { data: newSource, error: sError } = await supabase.from("rating_sources").insert({
                    name: row.source_name
                }).select("id").single()
                if (sError) throw sError
                sourceId = newSource.id
            }

            // 6. Pro Rating (Upsert)
            // Unique key: variant_id, source_id, reference_url
            // Note: Upstream constraints say unique(variant_id, source_id, reference_url)
            // If same URL, update score.
            const ratingData = {
                variant_id: variantId,
                source_id: sourceId,
                score: parseFloat(row.score),
                score_max: row.score_max ? parseFloat(row.score_max) : null,
                reference_url: row.reference_url,
                published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
                note: row.note
            }

            const { error: rError } = await supabase.from("pro_ratings").upsert(ratingData, {
                onConflict: "variant_id,source_id,reference_url"
            })
            if (rError) throw rError

            successCount++

        } catch (e: any) {
            errorCount++
            errors.push(`${row.brand_name} ${row.variant_name}: ${e.message}`)
        }
    }

    return { successCount, errorCount, errors }
}
