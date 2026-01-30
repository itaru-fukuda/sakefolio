
import { createClient } from "@/lib/supabase/server"

export async function testSearch() {
    const supabase = await createClient()
    const query = "Test"
    const q = `%${query}%`

    console.log("Testing search with query:", q)

    const dbQuery = supabase
        .from("variants")
        .select(`
            id,
            name,
            brand:brands!inner (
                name
            )
        `)
        .or(`name.ilike.${q},brand.name.ilike.${q}`)
        .limit(5)

    const { data, error } = await dbQuery

    if (error) {
        console.error("Search Error Full:", JSON.stringify(error, null, 2))
    } else {
        console.log("Search Success:", data)
    }
}
