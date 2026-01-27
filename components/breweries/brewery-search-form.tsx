"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BrewerySearchSchema = z.object({
    query: z.string().optional(),
    prefectureCode: z.string().optional(),
})

interface BrewerySearchFormProps {
    prefectures: { code: string; name: string }[]
}

export function BrewerySearchForm({ prefectures }: BrewerySearchFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const form = useForm<z.infer<typeof BrewerySearchSchema>>({
        resolver: zodResolver(BrewerySearchSchema),
        defaultValues: {
            query: searchParams.get("q") || "",
            prefectureCode: searchParams.get("pref") || "all",
        },
    })

    function onSubmit(values: z.infer<typeof BrewerySearchSchema>) {
        const params = new URLSearchParams()
        if (values.query) params.set("q", values.query)
        if (values.prefectureCode && values.prefectureCode !== "all") {
            params.set("pref", values.prefectureCode)
        }

        router.push(`/breweries?${params.toString()}`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                    <Search className="h-6 w-6" />
                    酒造検索
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>キーワード</FormLabel>
                                    <FormControl>
                                        <Input placeholder="酒造名..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prefectureCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>都道府県</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="すべて" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="all">すべて</SelectItem>
                                            {prefectures.map((pref) => (
                                                <SelectItem key={pref.code} value={pref.code}>
                                                    {pref.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" size="lg">
                            検索する
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
