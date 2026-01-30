"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { LoginSchema, SignupSchema } from "@/lib/validations/auth" // I will create this next
import { z } from "zod"

export async function login(formData: z.infer<typeof LoginSchema>) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/")
}

export async function signup(formData: z.infer<typeof SignupSchema>) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                display_name: formData.display_name,
            }
        }
    })

    if (error) {
        console.error("Signup error:", error)
        if (error.message.includes("User already registered") || error.code === "user_already_exists") {
            return { error: "このメールアドレスは既に登録されています。" }
        }
        return { error: "アカウント作成に失敗しました。" + error.message }
    }

    revalidatePath("/", "layout")
    redirect("/?signup=success")
}
