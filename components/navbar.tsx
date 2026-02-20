"use client";

import Link from "next/link";
import React, { Suspense } from "react";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { AuthButton } from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";

const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white h-16 flex items-center justify-center shadow-md">
      <div className="w-full max-w-5xl flex justify-between items-center px-5">
        {/* Left: App Name */}
        <div className="text-xl font-bold">
          <Link href="/">SmartBookmark</Link>
        </div>

        {/* Right: Auth / Env Warning */}
        <div className="flex items-center gap-3">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;