import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { format } from "date-fns"
import { LogOut, Plus, Search, Book, User as UserIcon } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch basic profile info
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    // Fetch summary stats (e.g. log count)
    const { count: logCount } = await supabase
        .from("drink_logs")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)

    return (
        <div className="container py-10 px-4 mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold font-serif mb-8">マイページ</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <Card className="md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-muted h-20 w-20 rounded-full flex items-center justify-center mb-4">
                            <UserIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <CardTitle>{profile?.display_name || "名無しさん"}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-2xl font-bold">{logCount || 0}</div>
                        <div className="text-xs text-muted-foreground">総記録数</div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle>記録をはじめる</CardTitle>
                        <CardDescription>新しい日本酒との出会いを記録しましょう。</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Button asChild className="h-20 text-lg" variant="outline">
                            <Link href="/logs/new">
                                <Plus className="mr-2 h-6 w-6" />
                                ログを記録
                            </Link>
                        </Button>
                        <Button asChild className="h-20 text-lg" variant="outline">
                            <Link href="/search">
                                <Search className="mr-2 h-6 w-6" />
                                ログを検索
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold font-serif mb-4 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                最近の活動
            </h2>
            <div className="bg-muted/20 rounded-lg p-8 text-center border border-dashed">
                <p className="text-muted-foreground mb-4">最新の記録一覧はこちらから確認できます</p>
                <Button asChild>
                    <Link href="/logs">すべての記録を見る</Link>
                </Button>
            </div>
        </div>
    )
}
