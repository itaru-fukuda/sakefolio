import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { User } from "@supabase/supabase-js"

export const getCurrentUser = cache(async (): Promise<User | null> => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
})
