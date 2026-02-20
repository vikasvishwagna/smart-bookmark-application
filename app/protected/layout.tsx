import Navbar from "@/components/navbar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Instagram, Facebook, Twitter, Mail } from "lucide-react"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Navbar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-700">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-10 flex flex-col gap-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 dark:bg-gray-800 py-8 px-5 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left: branding + description */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h2 className="text-xl font-bold text-black dark:text-white">SmartBookmark</h2>
            <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
              Organize your bookmarks efficiently and securely.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              contact@smartbookmark.com
            </p>
          </div>

          {/* Right: social icons + theme switcher */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition">
              <Twitter size={20} />
            </a>
            <a href="mailto:contact@smartbookmark.com" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition">
              <Mail size={20} />
            </a>
            <ThemeSwitcher />
          </div>
        </div>
      </footer>
    </div>
  )
}