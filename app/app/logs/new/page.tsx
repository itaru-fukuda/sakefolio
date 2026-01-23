import { createClient } from "@/lib/supabase/server"
import { LogForm } from "@/components/logs/log-form"
import { redirect } from "next/navigation"

interface PageProps {
    searchParams: Promise<{ variant_id?: string }>
}

export default async function NewLogPage({ searchParams }: PageProps) {
    const { variant_id } = await searchParams
    const supabase = await createClient()

    // Protect Route
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch all variants for selection
    // In a real app with many items, this should be done via API search or infinite scroll combobox
    const { data: variants } = await supabase
        .from("variants")
        .select(`
      id,
      name,
      brand_id,
      brand:brands(name)
    `)
        .eq("is_active", true)
        .order("name")

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">飲酒ログを記録</h1>
            {/* @ts-ignore */}
            <LogForm variants={variants || []} defaultVariantId={variant_id} />
        </div>
    )
}
