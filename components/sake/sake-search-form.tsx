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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const SakeSearchSchema = z.object({
    query: z.string().optional(),
    tagIds: z.array(z.number()).optional(),
})

interface SakeSearchFormProps {
    availableTags: { id: number; tag: string }[]
}

export function SakeSearchForm({ availableTags }: SakeSearchFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const form = useForm<z.infer<typeof SakeSearchSchema>>({
        resolver: zodResolver(SakeSearchSchema),
        defaultValues: {
            query: searchParams.get("q") || "",
            tagIds: searchParams.get("tags")?.split(",").map(Number).filter(n => !isNaN(n)) || [],
        },
    })

    function onSubmit(values: z.infer<typeof SakeSearchSchema>) {
        const params = new URLSearchParams()
        if (values.query) params.set("q", values.query)
        if (values.tagIds && values.tagIds.length > 0) {
            params.set("tags", values.tagIds.join(","))
        }

        // Push to /search path
        router.push(`/search?${params.toString()}`)
    }

    const selectedTagIds = form.watch("tagIds") || []

    const toggleTag = (id: number) => {
        const current = form.getValues("tagIds") || []
        if (current.includes(id)) {
            form.setValue("tagIds", current.filter(tagId => tagId !== id))
        } else {
            form.setValue("tagIds", [...current, id])
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                    <Search className="h-6 w-6" />
                    日本酒データベース検索
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>キーワード</FormLabel>
                                    <FormControl>
                                        <Input placeholder="銘柄名、酒蔵名など..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        銘柄名や酒蔵名を指定して検索します。
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <div className="space-y-3">
                            <FormLabel>フレーバータグ</FormLabel>
                            <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-md border max-h-[300px] overflow-y-auto">
                                {availableTags.map((tag) => {
                                    const isSelected = selectedTagIds.includes(tag.id)
                                    return (
                                        <Badge
                                            key={tag.id}
                                            variant={isSelected ? "default" : "outline"}
                                            className={cn(
                                                "cursor-pointer hover:opacity-80 transition-all select-none px-3 py-1",
                                                isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border"
                                            )}
                                            onClick={() => toggleTag(tag.id)}
                                        >
                                            {tag.tag}
                                        </Badge>
                                    )
                                })}
                            </div>
                            <FormDescription>
                                指定した特徴を持つ銘柄を絞り込みます（OR条件）。
                            </FormDescription>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            検索する
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
