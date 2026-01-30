import { createClient } from "@/lib/supabase/server"

export async function checkCategories() {
    const supabase = await createClient()
    const { data } = await supabase.from("sakenowa_flavor_tags").select("category").eq("delete_flag", 0)
    const categories = Array.from(new Set(data?.map(d => d.category))).filter(Boolean)
    console.log("Categories:", categories)
    return categories
}
