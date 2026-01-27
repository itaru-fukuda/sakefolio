"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { removeFromWishlist } from "@/lib/actions/wishlist"
import { useTransition } from "react"
import { toast } from "sonner"

export function WishlistRemoveButton({ variantId }: { variantId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleRemove = () => {
        if (!confirm("リストから削除しますか？")) return

        startTransition(async () => {
            try {
                await removeFromWishlist(variantId)
                toast.success("リストから削除しました")
            } catch (e) {
                toast.error("削除に失敗しました")
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
        >
            <Trash className="w-4 h-4" />
        </Button>
    )
}
