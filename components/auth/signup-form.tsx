"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupSchema } from "@/lib/validations/auth"
import { signup } from "@/lib/actions/auth"
import type { z } from "zod"

export function SignupForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = React.useState<string | null>(null)

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            display_name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof SignupSchema>) {
        setError(null)
        startTransition(async () => {
            const result = await signup(values)
            if (result?.error) {
                setError(result.error)
            } else {
                toast.success("アカウント作成確認メールを送信しました。")
            }
        })
    }

    const [showPasswordGenerator, setShowPasswordGenerator] = React.useState(false)

    function generatePassword() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        let password = ""
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        form.setValue("password", password)
        // Optionally show the password briefly or keep it masked but let them know
        toast.success("強力なパスワードを生成しました")
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="display_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>表示名 (任意)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Taro Sake" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>メールアドレス</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} autoComplete="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel>パスワード</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            {...field}
                                            autoComplete="new-password"
                                            onFocus={() => setShowPasswordGenerator(true)}
                                            onBlur={() => setTimeout(() => setShowPasswordGenerator(false), 200)} // Delay to allow click
                                        />
                                        {showPasswordGenerator && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    generatePassword()
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded shadow hover:bg-primary/90 transition-opacity"
                                            >
                                                自動生成
                                            </button>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "登録中..." : "アカウント作成"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
