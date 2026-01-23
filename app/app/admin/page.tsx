import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">管理画面</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>データインポート</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            プロ評価データなどをCSVから一括登録します。
                        </p>
                        <Button asChild>
                            <Link href="/app/admin/import">Import CSV</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>マスタ管理 (未実装)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            酒蔵・銘柄・派生・タグの編集を行います。(Supabase等で直接操作してください)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>外部データ同期</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            「さけのわ」APIから最新の酒蔵・銘柄データを取得して同期します。
                        </p>
                        <Button asChild variant="secondary">
                            <Link href="/app/admin/sync">データ同期へ</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
