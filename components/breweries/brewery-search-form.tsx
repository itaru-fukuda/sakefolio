"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Check, ChevronsUpDown, X } from "lucide-react"

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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BrewerySearchSchema = z.object({
    query: z.string().optional(),
    prefectureCodes: z.array(z.string()).optional(),
})

interface BrewerySearchFormProps {
    prefectures: { code: string; name: string }[]
}

export function BrewerySearchForm({ prefectures }: BrewerySearchFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize from URL params
    const initialPrefCodes = searchParams.get("pref")
        ? searchParams.get("pref")!.split(",").filter(Boolean)
        : []

    const form = useForm<z.infer<typeof BrewerySearchSchema>>({
        resolver: zodResolver(BrewerySearchSchema),
        defaultValues: {
            query: searchParams.get("q") || "",
            prefectureCodes: initialPrefCodes,
        },
    })

    function onSubmit(values: z.infer<typeof BrewerySearchSchema>) {
        const params = new URLSearchParams()
        if (values.query) params.set("q", values.query)
        if (values.prefectureCodes && values.prefectureCodes.length > 0) {
            params.set("pref", values.prefectureCodes.join(","))
        }

        router.push(`/breweries?${params.toString()}`)
    }

    const [open, setOpen] = React.useState(false)

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
                            name="prefectureCodes"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>都道府県（複数選択可）</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value?.length && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value?.length && field.value.length > 0
                                                        ? `${field.value.length}件選択中`
                                                        : "都道府県を選択"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="都道府県を検索..." />
                                                <CommandList>
                                                    <CommandEmpty>見つかりませんでした</CommandEmpty>
                                                    <CommandGroup className="max-h-64 overflow-y-auto">
                                                        {prefectures.map((pref) => (
                                                            <CommandItem
                                                                value={pref.name}
                                                                key={pref.code}
                                                                onSelect={() => {
                                                                    const current = field.value || []
                                                                    const isSelected = current.includes(pref.code)
                                                                    const newValue = isSelected
                                                                        ? current.filter((value) => value !== pref.code)
                                                                        : [...current, pref.code]

                                                                    form.setValue("prefectureCodes", newValue)
                                                                    // Don't close on select to allow multiple
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value?.includes(pref.code)
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {pref.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {/* Selected Badges */}
                                    {field.value && field.value.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value.map((code) => {
                                                const pref = prefectures.find((p) => p.code === code)
                                                return pref ? (
                                                    <Badge key={code} variant="secondary" className="pl-2 pr-1 py-1">
                                                        {pref.name}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="ml-1 h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                                            onClick={() => {
                                                                const newValue = field.value?.filter((v) => v !== code)
                                                                form.setValue("prefectureCodes", newValue || [])
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </Badge>
                                                ) : null
                                            })}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs h-auto py-1 px-2"
                                                onClick={() => form.setValue("prefectureCodes", [])}
                                            >
                                                クリア
                                            </Button>
                                        </div>
                                    )}
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
