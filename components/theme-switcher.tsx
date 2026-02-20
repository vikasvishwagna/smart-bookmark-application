"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // ensure client-only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ICON_SIZE = 18;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Sun size={ICON_SIZE} />
          ) : theme === "dark" ? (
            <Moon size={ICON_SIZE} />
          ) : (
            <Laptop size={ICON_SIZE} />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40 p-2" align="start">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" value="light">
            <Sun size={ICON_SIZE} /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" value="dark">
            <Moon size={ICON_SIZE} /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" value="system">
            <Laptop size={ICON_SIZE} /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };