import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SakenowaSync } from "@/components/admin/sakenowa-sync"
import { CsvImporter } from "@/components/admin/csv-importer" // Assuming export name
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single()

    if (profile?.role !== "admin") {
        redirect("/")
    }

    return (
        <div className="container py-10 px-4 mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold font-serif mb-2">管理画面</h1>
            <p className="text-muted-foreground mb-8">マスターデータやコンテンツの管理を行います。</p>

            <Tabs defaultValue="sakenowa" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="sakenowa">さけのわデータ同期</TabsTrigger>
                    <TabsTrigger value="csv">プロ評価CSVインポート</TabsTrigger>
                </TabsList>

                <TabsContent value="sakenowa">
                    <Card>
                        <CardHeader>
                            <CardTitle>さけのわAPI連携</CardTitle>
                            <CardDescription>
                                「さけのわ」のオープンデータAPIから、酒蔵・銘柄・フレーバータグを取得してデータベースに同期します。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SakenowaSync />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="csv">
                    <Card>
                        <CardHeader>
                            <CardTitle>専門家評価インポート</CardTitle>
                            <CardDescription>
                                CSVファイルからプロの評価データを一括登録します。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CsvImporter />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
