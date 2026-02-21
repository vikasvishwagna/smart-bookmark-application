"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import BookmarkForm from "./bookmarkForm"
import BookmarkList from "./bookmarkList"
import { Bookmark } from "./types"

export default function ProtectedPageComponent() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const supabase = createClient()

  // Fetch bookmarks for current user
  const fetchBookmarks = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) console.error(error)
    else setBookmarks(data || [])
  }

  // Add bookmark 
  const handleAddBookmark = async (title: string, url: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) return

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id
    })
    if (error) console.error(error)
  }

  // Delete bookmark 
  const handleDeleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id)
    if (error) console.error(error)
    else setBookmarks(prev => prev.filter(b => b.id !== id)) // optional
  }

  useEffect(() => {
    let isMounted = true
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const userId = user.id

      if (isMounted) await fetchBookmarks()

      // Subscribe to INSERT
      const insertSub = supabase
        .channel(`bookmarks-insert-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            const newBookmark = payload.new as Bookmark
            setBookmarks(prev => {
              if (prev.some(b => b.id === newBookmark.id)) return prev
              return [newBookmark, ...prev]
            })
          }
        )
        .subscribe()

      // Subscribe to DELETE
      const deleteSub = supabase
        .channel(`bookmarks-delete-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            const deletedId = (payload.old as Bookmark)?.id
            if (!deletedId) return
            setBookmarks(prev => prev.filter(b => b.id !== deletedId))
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      isMounted = false
        supabase.removeAllChannels()
      
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center">Bookmark Manager</h1>
      <BookmarkForm onAddBookmark={handleAddBookmark} />
      <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
    </div>
  )
}