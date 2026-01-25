"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { SakeRegistrationSchema } from "@/lib/validations/sake"
import { createCustomSake } from "@/lib/actions/sake"

interface SakeFormProps {
    breweries: { id: string; name: string }[]
    prefectures: { code: string; name: string }[]
    onSuccess?: (variantId: string) => void
    onCancel?: () => void
}

const NEW_BREWERY_ID = "NEW_BREWERY_ENTRY"

export function SakeForm({ breweries, prefectures, onSuccess, onCancel }: SakeFormProps) {
    const [isPending, startTransition] = useTransition()
    const [openBrewery, setOpenBrewery] = useState(false)
    const [isNewBreweryMode, setIsNewBreweryMode] = useState(false)
    const [availableTypes, setAvailableTypes] = useState<string[]>([])

    // Load available types on mount
    React.useEffect(() => {
        getSakeTypes().then((types) => {
            setAvailableTypes(types)
        })
    }, [])

    // Helper to sort breweries: Common ones first? Or just alphabetical?
    // Let's rely on list order.

    const form = useForm<z.infer<typeof SakeRegistrationSchema>>({
        resolver: zodResolver(SakeRegistrationSchema) as any,
        defaultValues: {
            breweryName: "",
            prefectureCode: "",
            brandName: "",
            variantName: "",
            type: "",
            abv: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof SakeRegistrationSchema>) {
        startTransition(async () => {
            const result = await createCustomSake(values)
            if (result.error) {
                toast.error(result.error)
            } else if (result.success && result.variantId) {
                toast.success("銘柄を登録しました！")
                form.reset()
                setIsNewBreweryMode(false)
                if (onSuccess) {
                    onSuccess(result.variantId)
                }
            }
        })
    }

    const toggleNewBreweryMode = () => {
        setIsNewBreweryMode(!isNewBreweryMode)
        form.setValue("breweryName", "")
        form.setValue("prefectureCode", "")
        setOpenBrewery(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Brewery Field */}
                {!isNewBreweryMode ? (
                    <FormField
                        control={form.control}
                        name="breweryName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>酒蔵</FormLabel>
                                <Popover open={openBrewery} onOpenChange={setOpenBrewery} modal={true}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openBrewery}
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? field.value
                                                    : "酒蔵を選択"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="酒蔵を検索..." />
                                            <CommandList>
                                                <CommandEmpty className="py-2 px-2 text-center text-sm">
                                                    <p className="text-muted-foreground mb-2">見つかりません</p>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={toggleNewBreweryMode}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        新しい酒蔵を登録する
                                                    </Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {breweries.map((brewery) => (
                                                        <CommandItem
                                                            value={brewery.name}
                                                            key={brewery.id}
                                                            keywords={[brewery.name]}
                                                            onSelect={(currentValue) => {
                                                                console.log("Selected:", brewery.name)
                                                                form.setValue("breweryName", brewery.name, {
                                                                    shouldValidate: true
                                                                })
                                                                setOpenBrewery(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    brewery.name === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {brewery.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    リストにない場合は
                                    <Button
                                        variant="link"
                                        className="px-1 font-normal h-auto"
                                        onClick={toggleNewBreweryMode}
                                        type="button"
                                    >
                                        新しい酒蔵を登録
                                    </Button>
                                    してください。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : (
                    <div className="space-y-4 rounded-md border p-4 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">新しい酒蔵の登録</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleNewBreweryMode}
                                type="button"
                            >
                                既存の酒蔵から選ぶ
                            </Button>
                        </div>
                        <FormField
                            control={form.control}
                            name="breweryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>酒蔵名</FormLabel>
                                    <FormControl>
                                        <Input placeholder="例：新政酒造" {...field} />
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
                                                <SelectValue placeholder="都道府県を選択" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                    </div>
                )}

                {/* Brand Name */}
                <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>銘柄名</FormLabel>
                            <FormControl>
                                <Input placeholder="例：No.6" {...field} />
                            </FormControl>
                            <FormDescription>
                                ラベルに大きく書かれている名前です。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Variant Name */}
                <FormField
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>商品名</FormLabel>
                            <FormControl>
                                <Input placeholder="例：X-type, Black Label" {...field} />
                            </FormControl>
                            <FormDescription>
                                具体的な商品名を入力してください。商品名がない場合は「標準」などでOKです。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Type/Method (Presets + Input) */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>種類・特定名称・製法 (任意)</FormLabel>
                            <div className="flex gap-2">
                                <Select
                                    value={availableTypes.includes(field.value) ? field.value : undefined}
                                    onValueChange={(value) => {
                                        const current = field.value || ""
                                        if (!current) {
                                            field.onChange(value)
                                        } else if (!current.includes(value)) {
                                            field.onChange(`${current} ${value}`)
                                        }
                                        // If already included, do nothing or maybe toggle?
                                        // For now just append if missing.
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue placeholder="定型リスト" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableTypes.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormControl>
                                    <Input placeholder="純米吟醸、生酒など" className="flex-1" {...field} />
                                </FormControl>
                            </div>
                            <FormDescription>
                                リストから選ぶか、自由に直接入力・編集できます（複数入力可）。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ABV (Optional) */}
                <FormField
                    control={form.control}
                    name="abv"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>アルコール度数 (%) (任意)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="例：15" {...field} />
                            </FormControl>
                            <FormDescription>
                                分かる場合はパーセントで入力してください。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            キャンセル
                        </Button>
                    )}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "登録中..." : "登録する"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
