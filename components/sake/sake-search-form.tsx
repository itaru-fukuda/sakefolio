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
    availableTags: { id: number; tag: string; category?: string | null }[]
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



                        <div className="space-y-4">
                            <FormLabel>フレーバータグ</FormLabel>

                            {/* Group tags by category */}
                            {Object.entries(
                                availableTags.reduce((acc, tag) => {
                                    const cat = tag.category || "その他"
                                    if (!acc[cat]) acc[cat] = []
                                    acc[cat].push(tag)
                                    return acc
                                }, {} as Record<string, typeof availableTags>)
                            ).map(([category, tags]) => (
                                <div key={category} className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground border-l-2 pl-2 border-primary/50">
                                        {category === "Aroma" ? "香り" :
                                            category === "Taste" ? "味わい" :
                                                category === "Texture" ? "質感・余韻" :
                                                    category === "Temperature" ? "温度帯" :
                                                        category === "Other" ? "その他特徴" :
                                                            category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => {
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
                                </div>
                            ))}

                            <FormDescription>
                                指定した特徴を持つ銘柄を絞り込みます（AND条件）。
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
