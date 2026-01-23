import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SakeNewClientPage } from "./page-client"

export default async function NewSakePage() {
    const supabase = await createClient()

    // Protect Route
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch Prefectures
    const { data: prefectures } = await supabase
        .from("prefectures")
        .select("code, name")
        .order("code")

    // Fetch Breweries
    const { data: breweries } = await supabase
        .from("breweries")
        .select("id, name")
        .order("name")

    return (
        <SakeNewClientPage
            breweries={breweries || []}
            prefectures={prefectures || []}
        />
    )
}
