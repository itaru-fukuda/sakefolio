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
import { useRouter } from "next/navigation"


import { DrinkLogSchema } from "@/lib/validations/log"
import { createLog } from "@/lib/actions/log"
import type { z } from "zod"
import { getSakeTypes } from "@/lib/actions/sake"

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
            is_public: false,
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
                    <Popover open={openBrandCombobox} onOpenChange={setOpenBrandCombobox} modal={true}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openBrandCombobox}
                                    className={cn(
                                        "w-full justify-between",
                                        !selectedBrandId && "text-muted-foreground"
                                    )}
                                >
                                    {selectedBrandId
                                        ? brands.find((b) => b.id === selectedBrandId)?.name
                                        : "銘柄を選択"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command
                                filter={(value, search) => {
                                    if (value.includes(search)) return 1
                                    return 0
                                }}
                            >
                                <CommandInput placeholder="銘柄を検索..." />
                                <CommandList>
                                    <CommandEmpty className="py-6 text-center text-sm">
                                        <p className="text-muted-foreground mb-4">見つかりません</p>
                                        <SakeRegistrationDialog
                                            onSuccess={(id) => {
                                                router.refresh()
                                                form.setValue("variant_id", id, { shouldValidate: true })
                                                setOpenBrandCombobox(false)
                                            }}
                                        />
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {brands.map((brand) => (
                                            <CommandItem
                                                value={brand.name}
                                                key={brand.id}
                                                keywords={[brand.name]}
                                                onSelect={() => {
                                                    setSelectedBrandId(brand.id)
                                                    form.setValue("variant_id", "")
                                                    setOpenBrandCombobox(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedBrandId === brand.id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {brand.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
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
                            <Popover open={openVariantCombobox} onOpenChange={setOpenVariantCombobox} modal={true}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openVariantCombobox}
                                            disabled={!selectedBrandId}
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? filteredVariants.find(
                                                    (variant) => variant.id === field.value
                                                )?.name
                                                : "商品名を選択"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command
                                        filter={(value, search) => {
                                            if (value.includes(search)) return 1
                                            return 0
                                        }}
                                    >
                                        <CommandInput placeholder="商品名を検索..." />
                                        <CommandList>
                                            <CommandEmpty className="py-2 text-center text-sm">
                                                <p className="mb-2">見つかりません</p>
                                                {/* Allow opening registration dialog from here too for new variants of same brand? 
                                                    SakeRegistrationDialog supports pre-filling? Not yet. 
                                                    For now just text.
                                                */}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {filteredVariants.map((variant) => (
                                                    <CommandItem
                                                        value={variant.name}
                                                        key={variant.id}
                                                        keywords={[variant.name]}
                                                        onSelect={() => {
                                                            form.setValue("variant_id", variant.id, { shouldValidate: true })
                                                            setOpenVariantCombobox(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                variant.id === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{variant.name}</span>
                                                            {(variant.type) && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {variant.type}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>

                            </Popover>
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
                        // If value exists but not known, it's custom. 
                        // If value is empty, it depends on user interaction (handled by local state if needed, but let's try to derive or use a simple toggle).
                        // Actually, using a simple state for "is entering custom" is better.

                        // Select value logic:
                        // 1. If explicitly in custom mode ("Other" selected) OR value is present but not in list -> "OTHER"
                        // 2. If valid known type -> field.value
                        // 3. Else (empty/initial) -> undefined (Placeholder)
                        const selectValue = (isCustomType || (!!field.value && !isKnownType))
                            ? "OTHER"
                            : (isKnownType ? field.value : undefined)

                        return (
                            <FormItem>
                                <FormLabel>種類・製法</FormLabel>
                                <div className="flex gap-2">
                                    <Select
                                        value={selectValue}
                                        onValueChange={(value) => {
                                            if (value === "OTHER") {
                                                setIsCustomType(true)
                                            } else {
                                                field.onChange(value)
                                                setIsCustomType(false)
                                            }
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue placeholder="種類を選択" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableTypes.map((t) => (
                                                <SelectItem key={t} value={t}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="OTHER">その他</SelectItem>
                                        </SelectContent>
                                    </Select>

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
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
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
                                        selected={field.value}
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
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>評価 (1〜10)</FormLabel>
                            <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="点数" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <SelectItem key={num} value={num.toString()}>{num}点</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="aroma"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>香りメモ (任意)</FormLabel>
                                <FormControl>
                                    <Input placeholder="華やか、メロン系" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="taste"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>味メモ (任意)</FormLabel>
                                <FormControl>
                                    <Input placeholder="甘口、酸味強め" {...field} />
                                </FormControl>
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
