"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.button
        key={theme}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="rounded-full bg-gray-200 p-2 focus:outline-none dark:bg-gray-800"
        whileTap={{ scale: 0.9 }}
        whileHover={{ rotate: 20 }}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 90 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {theme === "light" ? (
          <Sun className="text-yellow-500" size={24} />
        ) : (
          <Moon className="text-blue-500" size={24} />
        )}
      </motion.button>
    </AnimatePresence>
  );
};
