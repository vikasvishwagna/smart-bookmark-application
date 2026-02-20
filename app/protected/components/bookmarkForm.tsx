"use client"
import { useState } from "react"

interface Props {
  onAddBookmark: (title: string, url: string) => void
}

export default function BookmarkForm({ onAddBookmark }: Props) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = () => {
    if (!title || !url) return
    onAddBookmark(title, url)
    setTitle("")
    setUrl("")
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-black">Add Bookmark</h2>

      <input
        type="text"
        placeholder="Bookmark title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-md px-4 py-2"
      />

      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border rounded-md px-4 py-2"
      />

      <button onClick={handleSubmit} className="w-full bg-black text-white rounded-md py-2">
        Add Bookmark
      </button>
    </div>
  )
}