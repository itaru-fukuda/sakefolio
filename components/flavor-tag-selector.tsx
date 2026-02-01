"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { getFlavorTags } from "@/lib/actions/log"

interface FlavorTagSelectorProps {
    value: string // comma separated
    onChange: (value: string) => void
    category?: string // "Aroma", "Taste", etc.
    placeholder?: string
}

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

export function FlavorTagSelector({ value, onChange, category, placeholder }: FlavorTagSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [availableTags, setAvailableTags] = React.useState<{ id: number, tag: string }[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const isDesktop = useMediaQuery("(min-width: 768px)")

    React.useEffect(() => {
        getFlavorTags(category).then(tags => {
            setAvailableTags(tags)
        })
    }, [category])

    const selectedTags = React.useMemo(() => {
        return value ? value.split("、").filter(Boolean) : []
    }, [value])

    const handleSelect = (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            // Remove
            const newTags = selectedTags.filter(t => t !== tagName)
            onChange(newTags.join("、"))
        } else {
            // Add
            const newTags = [...selectedTags, tagName]
            onChange(newTags.join("、"))
        }
        setInputValue("")
    }

    const handleAddCustom = () => {
        if (!inputValue) return
        if (!selectedTags.includes(inputValue)) {
            const newTags = [...selectedTags, inputValue]
            onChange(newTags.join("、"))
        }
        setInputValue("")
    }

    const triggerButton = (
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full font-normal">
            {placeholder || "タグを選択または入力"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    )

    const content = (
        <Command>
            <CommandInput
                placeholder="タグを検索・入力..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue) {
                        e.preventDefault()
                        handleAddCustom()
                    }
                }}
            />
            <CommandList>
                <CommandEmpty className="py-2 px-4 text-sm">
                    <p className="text-muted-foreground mb-2">候補が見つかりません</p>
                    {inputValue && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleAddCustom}
                        >
                            <Plus className="mr-2 h-3 w-3" />
                            "{inputValue}" を追加
                        </Button>
                    )}
                </CommandEmpty>
                <CommandGroup heading="候補リスト">
                    {availableTags.map((tag) => (
                        <CommandItem
                            key={tag.id}
                            value={tag.tag}
                            onSelect={() => handleSelect(tag.tag)}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTags.includes(tag.tag) ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {tag.tag}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )

    if (isDesktop) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleSelect(tag)}
                                className="hover:bg-muted rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">削除</span>
                            </button>
                        </Badge>
                    ))}
                </div>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {triggerButton}
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                        {content}
                    </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                    ※ 候補から選択するか、直接入力してEnterで追加できます。複数選択可。
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleSelect(tag)}
                            className="hover:bg-muted rounded-full p-0.5"
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">削除</span>
                        </button>
                    </Badge>
                ))}
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {triggerButton}
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col rounded-t-xl">
                    <SheetHeader className="px-4 py-2 border-b">
                        <SheetTitle>タグを選択</SheetTitle>
                        <SheetDescription className="sr-only">タグを選択または入力してください</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-hidden">
                        {content}
                    </div>
                </SheetContent>
            </Sheet>
            <p className="text-xs text-muted-foreground">
                ※ 候補から選択するか、直接入力してEnterで追加できます。複数選択可。
            </p>
        </div>
    )
}
