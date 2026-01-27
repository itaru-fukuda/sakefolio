"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ProfileSchema = z.object({
    display_name: z.string().min(1, "表示名は必須です").max(20, "表示名は20文字以内で入力してください"),
    avatar_url: z.string().optional(),
})

export type ProfileState = {
    message?: string
    errors?: {
        display_name?: string[]
        avatar_url?: string[]
    }
}

export async function updateProfile(prevState: any, formData: FormData): Promise<ProfileState> {
    const validatedFields = ProfileSchema.safeParse({
        display_name: formData.get("display_name"),
        avatar_url: formData.get("avatar_url"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "入力内容に誤りがあります。",
        }
    }

    const { display_name, avatar_url } = validatedFields.data
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { message: "ログインが必要です。" }
    }

    try {
        const { error } = await supabase
            .from("profiles")
            .update({
                display_name,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)

        if (error) {
            console.error("Profile update error:", error)
            return { message: "プロフィールの更新に失敗しました。" }
        }

        revalidatePath("/", "layout") // Revalidate everything to update header
        return { message: "プロフィールを更新しました。" }
    } catch (error) {
        return { message: "データベースエラーが発生しました。" }
    }
}
