"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Tag } from "lucide-react"

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
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const LogSearchSchema = z.object({
    query: z.string().optional(),
    abvRange: z.array(z.number()).length(2).optional(),
    tagIds: z.array(z.number()).optional(),
})

interface LogSearchFormProps {
    availableTags: { id: number; tag: string }[]
}

export function LogSearchForm({ availableTags }: LogSearchFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Parse initial values from URL if needed? 
    // Usually detailed search page is fresh, but if we want to hydrate:
    // const initialQ = searchParams.get("q") || ""

    const form = useForm<z.infer<typeof LogSearchSchema>>({
        resolver: zodResolver(LogSearchSchema),
        defaultValues: {
            query: "",
            abvRange: [0, 25],
            tagIds: [],
        },
    })

    function onSubmit(values: z.infer<typeof LogSearchSchema>) {
        const params = new URLSearchParams()
        if (values.query) params.set("q", values.query)
        if (values.abvRange) {
            params.set("min_abv", values.abvRange[0].toString())
            params.set("max_abv", values.abvRange[1].toString())
        }
        if (values.tagIds && values.tagIds.length > 0) {
            params.set("tags", values.tagIds.join(","))
        }

        router.push(`/logs?${params.toString()}`)
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
                    詳細検索
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
                                        <Input placeholder="銘柄名、香り、感想など..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        「にごり」「辛口」などの特徴や、自分のメモから検索します。
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="abvRange"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-2">
                                        <FormLabel>アルコール度数</FormLabel>
                                        <span className="text-sm text-muted-foreground font-mono">
                                            {field.value?.[0]}% - {field.value?.[1]}%
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Slider
                                            min={0}
                                            max={25}
                                            step={0.5}
                                            minStepsBetweenThumbs={1}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="py-4"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3">
                            <FormLabel>フレーバータグ (さけのわデータ)</FormLabel>
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
                                選択したタグの特徴を持つ銘柄を絞り込みます。
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
