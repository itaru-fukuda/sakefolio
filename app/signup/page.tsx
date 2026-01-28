import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-10">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">アカウント作成</CardTitle>
                    <CardDescription>
                        新しいアカウントを作成して、日本酒ライフを記録しましょう。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                        すでにアカウントをお持ちですか？{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            ログイン
                        </Link>
                    </p>
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50">
                        <p className="font-medium mb-1">メールアドレスの取り扱いについて</p>
                        登録されたメールアドレスは、ログインおよびアカウント管理の目的にのみ使用されます。
                        他のユーザーへの公開や、許可のないお知らせメールの送信は行いませんのでご安心ください。
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
