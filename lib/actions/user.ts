"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function followUser(targetUserId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Login required" }
    }

    if (user.id === targetUserId) {
        return { error: "Cannot follow yourself" }
    }

    const { error } = await supabase
        .from("follows")
        .insert({
            follower_id: user.id,
            following_id: targetUserId,
        })

    if (error) {
        console.error("Error following user:", error)
        return { error: "Failed to follow user" }
    }

    revalidatePath(`/users/${targetUserId}`)
    revalidatePath("/timeline")
    return { success: true }
}

export async function unfollowUser(targetUserId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Login required" }
    }

    const { error } = await supabase
        .from("follows")
        .delete()
        .match({
            follower_id: user.id,
            following_id: targetUserId,
        })

    if (error) {
        console.error("Error unfollowing user:", error)
        return { error: "Failed to unfollow user" }
    }

    revalidatePath(`/users/${targetUserId}`)
    revalidatePath("/timeline")
    return { success: true }
}

export async function getFollowStatus(targetUserId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { isFollowing: false }
    }

    const { data, error } = await supabase
        .from("follows")
        .select("created_at")
        .match({
            follower_id: user.id,
            following_id: targetUserId,
        })
        .single()

    if (error && error.code !== "PGRST116") { // PGRST116 is "Row not found" (which is fine)
        console.error("Error checking follow status:", error)
    }

    return { isFollowing: !!data }
}

export async function getFollowStats(userId: string) {
    const supabase = await createClient()

    // Count followers
    const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId)

    // Count following
    const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId)

    return {
        followersCount: followersCount || 0,
        followingCount: followingCount || 0,
    }
}

export async function searchUsers(query: string) {
    const supabase = await createClient()
    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!query || query.length < 2) {
        return []
    }

    const { data: users, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .ilike("display_name", `%${query}%`)
        .limit(20)

    if (error) {
        console.error("Error searching users:", error)
        return []
    }

    if (!currentUser || users.length === 0) {
        return users.map(u => ({ ...u, is_following: false, is_me: false }))
    }

    // Check follow status
    const targetIds = users.map((u) => u.user_id)
    const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUser.id)
        .in("following_id", targetIds)

    const followingSet = new Set(follows?.map((f) => f.following_id))

    return users.map((u) => ({
        ...u,
        is_following: followingSet.has(u.user_id),
        is_me: u.user_id === currentUser.id,
    }))
}
