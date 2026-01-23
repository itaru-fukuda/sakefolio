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
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        すでにアカウントをお持ちですか？{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            ログイン
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
