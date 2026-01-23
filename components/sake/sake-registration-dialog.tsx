"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SakeForm } from "@/components/sake/sake-form"
import { createClient } from "@/lib/supabase/client"
import { Plus } from "lucide-react"

interface SakeRegistrationDialogProps {
    trigger?: React.ReactNode
    onSuccess?: (variantId: string) => void
}

export function SakeRegistrationDialog({ trigger, onSuccess }: SakeRegistrationDialogProps) {
    const [open, setOpen] = useState(false)
    const [breweries, setBreweries] = useState<{ id: string; name: string }[]>([])
    const [prefectures, setPrefectures] = useState<{ code: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Fetch master data when dialog opens
    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                setIsLoading(true)
                const supabase = createClient()

                // Fetch Prefectures
                const { data: prefData } = await supabase
                    .from("prefectures")
                    .select("code, name")
                    .order("code")

                // Fetch Breweries (This might be large, maybe we should use server component or limit? 
                // For now, let's limit 1000 or use search. 
                // The form uses a client-side command filter for "breweries" prop.
                // If we have 2000+ breweries, fetching all is okayish (few KB).
                // Let's fetch all for simple UX.)
                const { data: brewData } = await supabase
                    .from("breweries")
                    .select("id, name")
                    .order("name", { ascending: true }) // Japanese sort might be weird without kana

                setPrefectures(prefData || [])
                setBreweries(brewData || [])
                setIsLoading(false)
            }
            fetchData()
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        新しい銘柄を登録
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>新しい銘柄の登録</DialogTitle>
                    <DialogDescription>
                        リストにない銘柄をデータベースに登録します。
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <SakeForm
                        breweries={breweries}
                        prefectures={prefectures}
                        onSuccess={(variantId) => {
                            setOpen(false)
                            if (onSuccess) onSuccess(variantId)
                        }}
                        onCancel={() => setOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
