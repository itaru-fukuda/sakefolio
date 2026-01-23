import { createClient } from "@/lib/supabase/server"
import { PrefectureSelector } from "@/components/prefectures/prefecture-selector"

export default async function PrefecturesPage() {
    const supabase = await createClient()
    const { data: prefectures } = await supabase
        .from("prefectures")
        .select("*")
        .order("code", { ascending: true })

    return (
        <div className="container mx-auto py-10 px-4">
            <PrefectureSelector prefectures={prefectures || []} />
        </div>
    )
}
