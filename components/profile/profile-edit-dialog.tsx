"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile, ProfileState } from "@/lib/actions/profile"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useState, useEffect } from "react"
import { Loader2, User } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const AVATARS = [
    { id: "sake_bottle", src: "/images/avatars/sake_bottle.png", alt: "徳利" },
    { id: "sake_cup", src: "/images/avatars/sake_cup.png", alt: "お猪口" },
    { id: "cedar_ball", src: "/images/avatars/cedar_ball.png", alt: "杉玉" },
    { id: "rice_ear", src: "/images/avatars/rice_ear.png", alt: "稲穂" },
    { id: "cat_sake", src: "/images/avatars/cat_sake.png", alt: "猫と酒" },
]

interface ProfileEditDialogProps {
    profile: { display_name: string | null; avatar_url: string | null }
}

export function ProfileEditDialog({ profile }: ProfileEditDialogProps) {
    const initialState: ProfileState = { message: "", errors: {} }
    const [state, formAction] = useActionState(updateProfile, initialState)
    const [open, setOpen] = useState(false)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(profile.avatar_url)

    useEffect(() => {
        if (state.message === "プロフィールを更新しました。") {
            setOpen(false)
        }
    }, [state.message])

    // Reset local state when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedAvatar(profile.avatar_url)
        }
    }, [open, profile.avatar_url])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    編集
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>プロフィールの編集</DialogTitle>
                        <DialogDescription>
                            表示名とアバターアイコンを変更できます。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="display_name">表示名</Label>
                            <Input
                                id="display_name"
                                name="display_name"
                                defaultValue={profile.display_name || ""}
                                placeholder="表示名"
                            />
                            {state.errors?.display_name && (
                                <p className="text-sm text-destructive">{state.errors.display_name.join(", ")}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>アバターアイコン</Label>
                            <input type="hidden" name="avatar_url" value={selectedAvatar || ""} />
                            <div className="grid grid-cols-5 gap-2">
                                {AVATARS.map((avatar) => (
                                    <div
                                        key={avatar.id}
                                        className={cn(
                                            "cursor-pointer rounded-full p-2 border-2 transition-all hover:scale-105 active:scale-95",
                                            selectedAvatar === avatar.src
                                                ? "border-primary bg-primary/20 shadow-md ring-2 ring-primary/20 ring-offset-1"
                                                : "border-foreground/40 bg-blue-100 hover:border-primary/50 hover:bg-blue-200"
                                        )}
                                        onClick={() => setSelectedAvatar(avatar.src)}
                                    >
                                        <div className="relative aspect-square w-full rounded-full overflow-hidden">
                                            <Image
                                                src={avatar.src}
                                                alt={avatar.alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        {state.message && (
                            <p className="text-sm text-muted-foreground mr-auto self-center">
                                {state.message}
                            </p>
                        )}
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
        </Button>
    )
}


