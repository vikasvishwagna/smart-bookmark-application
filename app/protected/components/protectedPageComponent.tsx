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
    if (userError || !user) return console.error("No user logged in")

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) console.error("Error fetching bookmarks:", error.message)
    else setBookmarks(data || [])
  }

  // Add bookmark
  const handleAddBookmark = async (title: string, url: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return console.error("No user logged in")

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ title, url, user_id: user.id })
      .select()

    if (error) return console.error("Error adding bookmark:", error.message)
    setBookmarks([...(data || []), ...bookmarks])
  }

  // Delete bookmark
  const handleDeleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id)
    if (error) console.error("Error deleting bookmark:", error.message)
    else setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  useEffect(() => {
    fetchBookmarks()

    const subscription = supabase
      .channel("public:bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 ">
      <h1 className="text-4xl font-bold text-center">Bookmark Manager</h1>
      <BookmarkForm onAddBookmark={handleAddBookmark} />
      <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
    </div>
  )
}