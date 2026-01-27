"use client"

import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { addToWishlist } from "@/lib/actions/wishlist"
import { useTransition, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function WishlistAddButton({ variantId, className }: { variantId: string, className?: string }) {
    const [isPending, startTransition] = useTransition()
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        startTransition(async () => {
            try {
                const res = await addToWishlist(variantId)
                if (res.success) {
                    setAdded(true)
                    toast.success("リストに追加しました")
                }
            } catch (e) {
                toast.error("追加に失敗しました")
            }
        })
    }

    return (
        <Button
            variant={added ? "secondary" : "outline"}
            size="sm"
            className={cn("gap-2", className)}
            onClick={handleAdd}
            disabled={isPending || added}
        >
            {added ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {added ? "リスト登録済" : "飲みたい"}
        </Button>
    )
}
