import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-10">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">ログイン</CardTitle>
                    <CardDescription>
                        メールアドレスとパスワードを入力してください。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        アカウントをお持ちでないですか？{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            新規登録
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
