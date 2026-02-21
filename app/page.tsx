"use client";

import { AuthButton } from "@/components/auth-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-white">

      <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight">
        SmartBookmark
      </h1>

      <p className="text-center text-lg md:text-xl text-gray-300 mb-10 max-w-xl">
        Save your favorite links privately and access them anytime, anywhere.
      </p>

      {/* Auth Button */}
      <div>
        <AuthButton />
      </div>

      <footer className="mt-20 text-gray-500 text-sm text-center">
         SmartBookmark. All rights reserved.
      </footer>
    </main>
  );
}
