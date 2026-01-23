"use client"

import { useState, useTransition } from "react"
import { syncSakenowaData } from "@/lib/actions/sakenowa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

export function SakenowaSync() {
    const [isPending, startTransition] = useTransition()
    const [lastSyncResult, setLastSyncResult] = useState<string | null>(null)

    const handleSync = () => {
        startTransition(async () => {
            const result = await syncSakenowaData()
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("同期が完了しました")
                setLastSyncResult(result.message || "完了")
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>さけのわデータ同期</CardTitle>
                <CardDescription>
                    「さけのわ」のオープンデータAPIから、最新の酒蔵・銘柄データを取得してデータベースに取り込みます。
                    <br />
                    ※ データ量が多い場合、処理に時間がかかることがあります (数秒〜数十秒)。
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md bg-muted p-4 text-sm">
                    <p className="font-semibold mb-2">同期対象:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>全国の酒蔵データ (名称、都道府県)</li>
                        <li>各酒蔵の銘柄データ</li>
                    </ul>
                    {lastSyncResult && (
                        <div className="mt-4 p-2 bg-background border rounded text-green-600 font-medium">
                            {lastSyncResult}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSync} disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            同期中...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            同期を開始する
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
