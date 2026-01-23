"use client"

import { useRouter } from "next/navigation"
import { SakeForm } from "@/components/sake/sake-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface SakeNewClientPageProps {
    breweries: { id: string; name: string }[]
    prefectures: { code: string; name: string }[]
    referrer?: string
}

export function SakeNewClientPage({ breweries, prefectures }: SakeNewClientPageProps) {
    const router = useRouter()

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">新しいお酒の登録</h1>
                <p className="text-muted-foreground">
                    リストに見つからないお酒を登録します。登録後、すぐに飲酒ログを記録できます。
                </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <SakeForm
                    breweries={breweries}
                    prefectures={prefectures}
                    onSuccess={(id) => {
                        // Redirect to the new log page with this variant selected
                        router.push(`/app/logs/new?variant_id=${id}`)
                    }}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    )
}
