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

interface LogFormProps {
    variants: {
        id: string
        name: string
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

    const form = useForm<z.infer<typeof DrinkLogSchema>>({
        resolver: zodResolver(DrinkLogSchema) as any,
        defaultValues: {
            variant_id: defaultVariantId || "",
            rating: 5,
            comment: "",
            image_url: "",
        },
    })

    // Derived State: Unique Brands
    const brands = React.useMemo(() => {
        const uniqueBrands = new Map<string, string>(); // brand_id -> brand_name
        // Also map name -> id if brand_id is missing? 
        // We ensure brand_id is fetched now.
        // But for deduplication, we use brand_id if available, or name.
        // Actually, we need an ID to filter. Assuming brand_id is available.
        variants.forEach(v => {
            if (v.brand_id) {
                uniqueBrands.set(v.brand_id, v.brand.name)
            }
        })
        return Array.from(uniqueBrands.entries()).map(([id, name]) => ({ id, name }))
    }, [variants])

    // State for selected Brand (independent of form logic, but helps UI)
    const [selectedBrandId, setSelectedBrandId] = React.useState<string | null>(null)

    // Effect: If defaultVariantId is provided, set selectedBrandId
    React.useEffect(() => {
        if (defaultVariantId) {
            const variant = variants.find(v => v.id === defaultVariantId)
            if (variant && variant.brand_id) {
                setSelectedBrandId(variant.brand_id)
            }
        }
    }, [defaultVariantId, variants])

    // Filtered Variants based on selected Brand
    const filteredVariants = React.useMemo(() => {
        if (!selectedBrandId) return []
        return variants.filter(v => v.brand_id === selectedBrandId)
    }, [selectedBrandId, variants])

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
                                                // When registered, we get a variant_id.
                                                // We need to find its brand_id to set state.
                                                // Since variants prop might not update immediately for client logic without refresh logic...
                                                // router.refresh updates RSC payload, but 'variants' prop update depends on parent re-render.
                                                // Ideally NewLogPage re-renders.
                                                // For now, let's just assume we refresh and user selects it? 
                                                // Or better: The page reloads due to router.refresh?
                                                // Actually router.refresh is soft.
                                                // Let's set the form value directly to variant_id?
                                                form.setValue("variant_id", id, { shouldValidate: true })

                                                // We can't easily auto-select the brand without knowing the new relation unless we fetch it.
                                                // But form value is what matters for submission.
                                                // However, UI state (selectedBrandId) matters for the second dropdown.
                                                // Let's rely on backend refresh or simple message.
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
                                                    form.setValue("variant_id", "") // Reset variant when brand changes
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
                            <FormLabel>種類・特定名称</FormLabel>
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
                                                : "種類を選択"}
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
                                        <CommandInput placeholder="種類を検索..." />
                                        <CommandList>
                                            <CommandEmpty className="py-2 text-center text-sm">
                                                種類が見つかりません
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
                                                        {variant.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
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

                <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">公開する</FormLabel>
                                <FormDescription>
                                    このログを他のユーザーにも見えるようにしますか？
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>
                    {isPending ? "保存中..." : "保存する"}
                </Button>
            </form>
        </Form>
    )
}
