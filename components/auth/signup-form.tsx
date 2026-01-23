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

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            display_name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof SignupSchema>) {
        startTransition(async () => {
            const result = await signup(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("アカウント作成確認メールを送信しました。")
            }
        })
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
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>パスワード</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "登録中..." : "アカウント作成"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
