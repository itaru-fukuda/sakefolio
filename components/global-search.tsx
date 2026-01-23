"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { searchGlobal, type SearchResult } from "@/lib/actions/search"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    // Debounced search
    React.useEffect(() => {
        if (query.length < 1) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const data = await searchGlobal(query)
                setResults(data)
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Open on keypress
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="mx-auto flex max-w-lg items-center rounded-2xl border bg-background/60 p-2 shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:bg-background/80 cursor-text"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70 transition-colors group-focus-within:text-white" />
                    <div className="h-12 w-full flex items-center pl-10 text-base text-white/60">
                        銘柄・酒蔵を検索...
                    </div>
                </div>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="銘柄・酒蔵を入力..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            query.length > 0 && "見つかりませんでした"
                        )}
                    </CommandEmpty>

                    {!loading && results.length > 0 && (
                        <>
                            <CommandGroup heading="銘柄 (Brands)">
                                {results.filter(r => r.type === 'brand').map((result) => (
                                    <CommandItem
                                        key={result.id}
                                        value={`${result.name} ${result.subText}`}
                                        onSelect={() => {
                                            runCommand(() => router.push(`/brands/${result.id}`))
                                        }}
                                    >
                                        <span className="mr-2">🍶</span>
                                        <span>{result.name}</span>
                                        {result.subText && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                ({result.subText})
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandGroup heading="酒蔵 (Breweries)">
                                {results.filter(r => r.type === 'brewery').map((result) => (
                                    <CommandItem
                                        key={result.id}
                                        value={`${result.name} ${result.subText}`}
                                        onSelect={() => {
                                            runCommand(() => router.push(`/breweries/${result.id}`))
                                        }}
                                    >
                                        <span className="mr-2">🏭</span>
                                        <span>{result.name}</span>
                                        {result.subText && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {result.subText}
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
