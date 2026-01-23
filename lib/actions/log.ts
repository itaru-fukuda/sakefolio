"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { DrinkLogSchema } from "@/lib/validations/log"
import { z } from "zod"

export async function createLog(formData: z.infer<typeof DrinkLogSchema>) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "ログインが必要です" }
    }

    const { error } = await supabase.from("drink_logs").insert({
        user_id: user.id,
        variant_id: formData.variant_id,
        drank_on: formData.drank_on.toISOString(), // Supabase handles ISO string for date/timestamptz
        rating: formData.rating,
        impression: formData.impression,
        aroma: formData.aroma,
        taste: formData.taste,
        is_public: formData.is_public
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/app")
    redirect("/app")
}
