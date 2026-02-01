"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
} from "@/components/ui/sheet"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

export interface ComboboxItem {
    value: string
    label: string
    keywords?: string[]
}

interface ResponsiveComboboxProps<T extends ComboboxItem> {
    items: T[]
    selectedValue: string | null
    onSelect: (value: string | null) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyContent?: React.ReactNode
    renderItem?: (item: T, isSelected: boolean) => React.ReactNode
    disabled?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    label?: string // For Sheet Title
    hideSearch?: boolean
    className?: string
}

export function ResponsiveCombobox<T extends ComboboxItem>({
    items,
    selectedValue,
    onSelect,
    placeholder = "選択してください",
    searchPlaceholder = "検索...",
    emptyContent = "見つかりません",
    renderItem,
    disabled = false,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    label = "選択",
    hideSearch = false,
    className,
}: ResponsiveComboboxProps<T>) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const open = controlledOpen ?? internalOpen
    const setOpen = setControlledOpen ?? setInternalOpen

    const selectedItem = items.find((item) => item.value === selectedValue)

    const handleSelect = (value: string) => {
        onSelect(value === selectedValue ? null : value)
        setOpen(false)
    }

    const triggerButton = (
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between", className, !selectedItem && "text-muted-foreground")}
        >
            {selectedItem ? selectedItem.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    )

    const content = (
        <Command
            filter={(value, search) => {
                if (hideSearch) return 1
                const item = items.find(i => i.label === value)
                if (!item) return 0
                const searchLower = search.toLowerCase()
                if (item.label.toLowerCase().includes(searchLower)) return 1
                if (item.keywords?.some(k => k.toLowerCase().includes(searchLower))) return 1
                return 0
            }}
        >
            {!hideSearch && <CommandInput placeholder={searchPlaceholder} />}
            <CommandList>
                <CommandEmpty className="py-6 text-center text-sm">
                    {emptyContent}
                </CommandEmpty>
                <CommandGroup>
                    {items.map((item) => (
                        <CommandItem
                            key={item.value}
                            value={item.label} // Command uses value for filtering usually, tricky with IDs. Use label as internal value for CommandItem?
                            // Actually CommandItem value prop is used for filtering. Safe to use label or name. 
                            // But we need to pass back the REAL ID on select.
                            keywords={item.keywords}
                            onSelect={() => handleSelect(item.value)}
                        >
                            {renderItem ? (
                                renderItem(item, selectedValue === item.value)
                            ) : (
                                <>
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValue === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </>
                            )}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                    {triggerButton}
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    {content}
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {triggerButton}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col rounded-t-xl">
                <SheetHeader className="px-4 py-2 border-b">
                    <SheetTitle>{label}</SheetTitle>
                    <SheetDescription className="sr-only">{label}を選択します</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                    {content}
                </div>
            </SheetContent>
        </Sheet>
    )
}
