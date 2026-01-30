"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { followUser, unfollowUser } from "@/lib/actions/user"
import { toast } from "sonner"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"

interface FollowButtonProps {
    targetUserId: string
    initialIsFollowing: boolean
}

export function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(async () => {
            // Optimistic update
            setIsFollowing(!isFollowing)

            const action = isFollowing ? unfollowUser : followUser
            const result = await action(targetUserId)

            if (result.error) {
                setIsFollowing(initialIsFollowing) // Revert
                toast.error(result.error)
            } else {
                toast.success(isFollowing ? "フォロー解除しました" : "フォローしました")
            }
        })
    }

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <UserMinus className="mr-2 h-4 w-4" />
            ) : (
                <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isFollowing ? "フォロー中" : "フォローする"}
        </Button>
    )
}
