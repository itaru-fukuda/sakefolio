import { SakenowaSync } from "@/components/admin/sakenowa-sync"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoveLeft } from "lucide-react"

export const metadata = {
    title: "データ同期 | 管理画面",
}

export default function AdminSyncPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/app/admin">
                        <MoveLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">外部データ同期</h1>
            </div>

            <div className="grid gap-6">
                <SakenowaSync />
            </div>
        </div>
    )
}
