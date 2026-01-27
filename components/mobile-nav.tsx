"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <SheetHeader className="px-1 text-left">
                    <SheetTitle>
                        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                            <span className="font-bold">SAKEfolio</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-1 overflow-y-auto">
                    <div className="flex flex-col space-y-3">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            ホーム
                        </Link>
                        <Link
                            href="/search"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            日本酒検索
                        </Link>
                        <Link
                            href="/logs"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            飲酒記録一覧
                        </Link>
                        <Link
                            href="/prefectures"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            都道府県から探す
                        </Link>
                        <Link
                            href="/breweries"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            酒造から探す
                        </Link>
                        <Link
                            href="/wishlist"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            飲みたいリスト
                        </Link>
                        <Link
                            href="/logs/search"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground"
                        >
                            詳細検索
                        </Link>
                        <div className="py-2"></div>
                        <Link
                            href="/logs/new"
                            onClick={() => setOpen(false)}
                            className="text-foreground/70 transition-colors hover:text-foreground font-semibold"
                        >
                            ＋ 新しく記録する
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
