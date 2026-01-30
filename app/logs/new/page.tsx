import { createClient } from "@/lib/supabase/server"
import { LogForm } from "@/components/logs/log-form"
import { redirect } from "next/navigation"

export default async function NewLogPage({ searchParams }: { searchParams: Promise<{ variant_id?: string }> }) {
    const supabase = await createClient()

    const { variant_id } = await searchParams

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch variants for combobox
    const { data: variants } = await supabase
        .from("variants")
        .select(`
            id,
            name,
            type,
            brand_id,
            brand:brands (
                name
            )
        `)
        .eq("is_active", true)

    // Transform data to match LogForm props (Supabase returns arrays for joined relations)
    const formattedVariants = variants?.map((variant: any) => ({
        ...variant,
        brand: Array.isArray(variant.brand) ? variant.brand[0] : variant.brand,
    })) || []

    return (
        <div className="container max-w-2xl py-10 px-4 mx-auto">
            <h1 className="text-2xl font-bold font-serif mb-8">お酒を記録する</h1>
            <LogForm variants={formattedVariants} defaultVariantId={variant_id} />
        </div>
    )
}
