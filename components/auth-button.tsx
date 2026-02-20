"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";

export function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (u && u.email) {
        setUser({ email: u.email });
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/protected`,
      },
    });
    if (error) console.error("Login error:", error.message);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">Hey, {user.email}!</span>
        <LogoutButton className="text-black" />
      </div>
    );
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded shadow hover:shadow-md transition transform hover:-translate-y-0.5"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M533.5 278.4c0-17.7-1.5-35-4.6-51.9H272v98h146.7c-6.4 34.6-25.9 63.9-55.1 83.4v69.2h88.9c52.1-48 81.9-118.8 81.9-198.7z"
          fill="#4285F4"
        />
        <path
          d="M272 544.3c74.6 0 137.1-24.8 182.7-67.4l-88.9-69.2c-24.8 16.7-56.7 26.5-93.8 26.5-71.9 0-132.8-48.6-154.7-113.9H26.1v71.7C70.3 476.3 166.8 544.3 272 544.3z"
          fill="#34A853"
        />
        <path
          d="M117.3 321.9c-10.6-31.2-10.6-64.9 0-96.1V154.1H26.1C-0.5 202.8-0.5 341.5 26.1 389.2l91.2-67.3z"
          fill="#FBBC05"
        />
        <path
          d="M272 107.7c39.7 0 75.3 13.6 103.4 40.4l77.5-77.5C407.8 24.8 345.3 0 272 0 166.8 0 70.3 68 26.1 154.1l91.2 71.7C139.2 156.3 200.1 107.7 272 107.7z"
          fill="#EA4335"
        />
      </svg>
      Sign in with Google
    </button>
  );
}