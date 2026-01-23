import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Check Admin Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single()

    if (profile?.role !== "admin") {
        notFound() // Or show "Unauthorized"
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="bg-destructive/10 text-destructive p-2 mb-6 rounded text-center text-sm font-bold border border-destructive/20">
                管理者モードで表示中
            </div>
            {children}
        </div>
    )
}
