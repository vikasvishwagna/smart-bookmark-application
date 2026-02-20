"use client"

import { Bookmark } from "./types"
import { Trash2, ExternalLink } from "lucide-react"

interface Props {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}

export default function BookmarkList({ bookmarks, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-black">Your Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <div className="text-gray-400 border border-gray-200 rounded-md p-4 text-center">
          No bookmarks yet.
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm hover:shadow-md transition"
          >
            {/* Link with icon */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              {bookmark.title}
              <ExternalLink size={16} />
            </a>

            {/* Delete button */}
            <button
              onClick={() => onDelete(bookmark.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  )
}