"use client";

import { useTheme } from "@/components/ThemeProvider";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center rounded-full border border-yellow-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-colors duration-300 hover:border-yellow-300 hover:bg-yellow-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      <span className="flex items-center gap-2">
        {theme === "dark" ? (
          <>
            <FaSun className="h-4 w-4 text-yellow-300" />
            <span className="hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <FaMoon className="h-4 w-4 text-indigo-600" />
            <span className="hidden sm:inline">Dark</span>
          </>
        )}
      </span>
    </button>
  );
}
