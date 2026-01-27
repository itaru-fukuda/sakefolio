"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"

interface UserNavProps {
    user: User
    profile: { role: string | null; display_name: string | null; avatar_url: string | null } | null
}

export function UserNav({ user, profile }: UserNavProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={user.email || ""} className="object-cover" />
                        <AvatarFallback>{profile?.display_name?.slice(0, 1) || user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.display_name || user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/")}>
                        トップページ
                    </DropdownMenuItem>
                    {profile?.role === "admin" && (
                        <DropdownMenuItem onClick={() => router.push("/admin")}>
                            管理画面
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                        マイページ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/logs")}>
                        飲酒ログ一覧
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/logs/new")}>
                        新しいログを記録
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    ログアウト
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
