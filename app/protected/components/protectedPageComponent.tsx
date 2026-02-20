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

  // Add bookmark (do NOT update state manually; rely on real-time)
  const handleAddBookmark = async (title: string, url: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return console.error("No user logged in");

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    if (error) console.error("Error adding bookmark:", error.message);
  };

  // Delete bookmark
  const handleDeleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id)
    if (error) console.error("Error deleting bookmark:", error.message)
    else setBookmarks(bookmarks.filter(b => b.id !== id))
  }

useEffect(() => {
  let isMounted = true
  const setup = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const currentUserId = user.id

    // initial fetch
    if (isMounted) await fetchBookmarks()

    // subscribe
    const subscription = supabase
      .channel(`public:bookmarks:user=${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()
  }

  setup() // call async function

  // synchronous cleanup
  return () => {
    isMounted = false
    supabase.removeAllChannels()
  }
}, [])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 ">
      <h1 className="text-4xl font-bold text-center">Bookmark Manager</h1>
      <BookmarkForm onAddBookmark={handleAddBookmark} />
      <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
    </div>
  )
}