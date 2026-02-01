"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { toast } from "sonner"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"

import { SakeRegistrationDialog } from "@/components/sake/sake-registration-dialog"
import { FlavorTagSelector } from "@/components/flavor-tag-selector"
import { useRouter } from "next/navigation"


import { DrinkLogSchema } from "@/lib/validations/log"
import { createLog } from "@/lib/actions/log"
import type { z } from "zod"
import { getSakeTypes } from "@/lib/actions/sake"
import { ResponsiveCombobox, ComboboxItem } from "@/components/ui/responsive-combobox"

interface LogFormProps {
    variants: {
        id: string
        name: string
        type?: string | null
        brand_id?: string
        brand: {
            name: string
        }
    }[]
    defaultVariantId?: string
}

export function LogForm({ variants, defaultVariantId }: LogFormProps) {
    const [isPending, startTransition] = useTransition()
    const [openBrandCombobox, setOpenBrandCombobox] = React.useState(false)
    const [openVariantCombobox, setOpenVariantCombobox] = React.useState(false)
    const router = useRouter()

    const [availableTypes, setAvailableTypes] = React.useState<string[]>([])
    const [isCustomType, setIsCustomType] = React.useState(false)

    // Load available types on mount
    React.useEffect(() => {
        getSakeTypes().then((types) => {
            setAvailableTypes(types)
        })
    }, [])

    const form = useForm<z.infer<typeof DrinkLogSchema>>({
        resolver: zodResolver(DrinkLogSchema) as any,
        defaultValues: {
            variant_id: defaultVariantId || "",
            rating: 5,
            impression: "",
            is_public: true,
            type: "",
        },
    })

    // Derived State: Unique Brands
    const brands = React.useMemo(() => {
        const uniqueBrands = new Map<string, string>();
        variants.forEach(v => {
            if (v.brand_id) {
                uniqueBrands.set(v.brand_id, v.brand.name)
            }
        })
        return Array.from(uniqueBrands.entries()).map(([id, name]) => ({ id, name }))
    }, [variants])

    const [selectedBrandId, setSelectedBrandId] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (defaultVariantId) {
            const variant = variants.find(v => v.id === defaultVariantId)
            if (variant && variant.brand_id) {
                setSelectedBrandId(variant.brand_id)
            }
        }
    }, [defaultVariantId, variants])

    const filteredVariants = React.useMemo(() => {
        if (!selectedBrandId) return []
        return variants.filter(v => v.brand_id === selectedBrandId)
    }, [selectedBrandId, variants])

    const selectedVariant = variants.find(v => v.id === form.watch("variant_id"))

    React.useEffect(() => {
        if (selectedVariant) {
            form.setValue("type", selectedVariant.type || "")
            setIsCustomType(false)
        }
    }, [selectedVariant?.id, form])

    function onSubmit(values: z.infer<typeof DrinkLogSchema>) {
        startTransition(async () => {
            const result = await createLog(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("記録しました！")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Brand Selection */}
                <FormItem className="flex flex-col">
                    <FormLabel>銘柄</FormLabel>
                    <FormControl>
                        <ResponsiveCombobox
                            items={brands.map(b => ({ value: b.id, label: b.name, keywords: [b.name] }))}
                            selectedValue={selectedBrandId}
                            onSelect={(value) => {
                                if (value) {
                                    setSelectedBrandId(value)
                                    form.setValue("variant_id", "")
                                } else {
                                    // Handle clearing? LogForm didn't really allow clearing before (no X button), 
                                    // but handleSelect allows toggle off. 
                                    // If toggled off, clear selection
                                    setSelectedBrandId(null)
                                    form.setValue("variant_id", "")
                                }
                            }}
                            placeholder="銘柄を選択"
                            searchPlaceholder="銘柄を検索..."
                            label="銘柄を選択"
                            open={openBrandCombobox}
                            onOpenChange={setOpenBrandCombobox}
                            emptyContent={
                                <div className="py-6 text-center text-sm">
                                    <p className="text-muted-foreground mb-4">見つかりません</p>
                                    <SakeRegistrationDialog
                                        onSuccess={(id) => {
                                            router.refresh()
                                            // The ID returned is variant_id, assuming newly created.
                                            // But we need to know the brand too? 
                                            // SakeRegistrationDialog handles creation.
                                            // Actually form.setValue("variant_id", id) is what original code did.
                                            form.setValue("variant_id", id, { shouldValidate: true })
                                            setOpenBrandCombobox(false)
                                        }}
                                    />
                                </div>
                            }
                        />
                    </FormControl>
                    <FormDescription>
                        飲んだ銘柄を選択してください。リストにない場合は新規登録できます。
                    </FormDescription>
                </FormItem>

                {/* Variant Selection (Real field) */}
                <FormField
                    control={form.control}
                    name="variant_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>商品名</FormLabel>
                            <FormControl>
                                <ResponsiveCombobox
                                    items={filteredVariants.map(v => ({ value: v.id, label: v.name, keywords: [v.name], type: v.type }))}
                                    selectedValue={field.value}
                                    onSelect={(value) => {
                                        field.onChange(value)
                                    }}
                                    placeholder="商品名を選択"
                                    searchPlaceholder="商品名を検索..."
                                    label="商品名を選択"
                                    disabled={!selectedBrandId}
                                    open={openVariantCombobox}
                                    onOpenChange={setOpenVariantCombobox}
                                    renderItem={(item, isSelected) => (
                                        <>
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{item.label}</span>
                                                {((item as any).type) && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {(item as any).type}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    emptyContent={
                                        <div className="py-2 text-center text-sm">
                                            <p className="mb-2">見つかりません</p>
                                        </div>
                                    }
                                />
                            </FormControl>
                            <FormDescription>
                                該当する商品名がない場合は、銘柄選択に戻って「新規登録」を行ってください。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => {
                        // Determine if we should show custom input
                        const isKnownType = availableTypes.includes(field.value || "")

                        // Select value logic:
                        // 1. If explicitly in custom mode ("Other" selected) OR value is present but not in list -> "OTHER"
                        // 2. If valid known type -> field.value
                        // 3. Else (empty/initial) -> undefined (Placeholder)
                        const selectValue = (isCustomType || (!!field.value && !isKnownType))
                            ? "OTHER"
                            : (isKnownType ? (field.value ?? null) : null)

                        return (
                            <FormItem>
                                <FormLabel>種類・製法</FormLabel>
                                <div className="flex gap-2">
                                    <div className="w-[160px]">
                                        <ResponsiveCombobox
                                            items={[
                                                ...availableTypes.map(t => ({ value: t, label: t })),
                                                { value: "OTHER", label: "その他" }
                                            ]}
                                            selectedValue={selectValue}
                                            onSelect={(value) => {
                                                if (value === "OTHER") {
                                                    setIsCustomType(true)
                                                } else {
                                                    field.onChange(value)
                                                    setIsCustomType(false)
                                                }
                                            }}
                                            placeholder="種類を選択"
                                            searchPlaceholder="種類を検索..."
                                            label="種類・製法を選択"
                                        />
                                    </div>

                                    {/* Show Input if "OTHER" is selected or value is unknown (custom) */}
                                    {(isCustomType || (!isKnownType && !!field.value)) && (
                                        <FormControl>
                                            <Input
                                                placeholder="種類を入力"
                                                className="flex-1"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    setIsCustomType(true) // Ensure we stay in custom mode
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                </div>
                                <FormDescription>
                                    リストにない場合は「その他」を選んで入力してください。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                    <FormField
                        control={form.control}
                        name="drank_on"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>飲んだ日</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                disabled={form.watch("date_unknown")}
                                                className={cn(
                                                    "w-full sm:w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "yyyy/MM/dd")
                                                ) : (
                                                    <span>日付を選択</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date_unknown"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 sm:pt-9">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked)
                                            if (checked) {
                                                form.setValue("drank_on", undefined)
                                                form.clearErrors("drank_on")
                                            }
                                        }}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        日付不明
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>評価 (1〜10)</FormLabel>
                            <FormControl>
                                <ResponsiveCombobox
                                    items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({ value: num.toString(), label: `${num}点` }))}
                                    selectedValue={field.value.toString()}
                                    onSelect={(value) => {
                                        if (value) field.onChange(parseInt(value))
                                    }}
                                    placeholder="点数"
                                    label="評価を選択"
                                    hideSearch={true}
                                />
                            </FormControl>
                            <FormDescription>
                                10点満点で評価してください。
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="impression"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>感想 (ひとこと)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="美味しかった！フルーティー。"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="aroma"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>香り特徴 (タグ)</FormLabel>
                                <FormControl>
                                    <FlavorTagSelector
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        category="Aroma"
                                        placeholder="華やか、フルーティーなど"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="taste"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>味・印象 (タグ)</FormLabel>
                                <FormControl>
                                    <FlavorTagSelector
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        category="Taste"
                                        placeholder="甘口、すっきりなど"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="texture"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>質感・余韻 (タグ)</FormLabel>
                                <FormControl>
                                    <FlavorTagSelector
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        category="Texture"
                                        placeholder="とろみ、キレ、発泡感など"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="feature"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>その他特徴 (タグ)</FormLabel>
                                <FormControl>
                                    <FlavorTagSelector
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        category="Feature"
                                        placeholder="熟成、濁り、山廃など"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                            <FormItem className="flex flex-col sm:col-span-2">
                                <FormLabel>温度帯 (タグ)</FormLabel>
                                <FormControl>
                                    <FlavorTagSelector
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        category="Temperature"
                                        placeholder="冷酒、熱燗、常温など"
                                    />
                                </FormControl>
                                <FormDescription>
                                    飲んだ時の温度帯を選択してください。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "保存中..." : "保存する"}
                </Button>
            </form>
        </Form >
    )
}
