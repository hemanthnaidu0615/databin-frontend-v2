"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Theme types
type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Utility to apply PrimeReact theme dynamically
const applyPrimeTheme = (theme: Theme) => {
  const themeName = theme === "dark" ? "lara-dark-indigo" : "lara-light-indigo";
  const themeUrl = `https://unpkg.com/primereact/resources/themes/${themeName}/theme.css`;

  const existingLink = document.getElementById("theme-css") as HTMLLinkElement;

  if (existingLink) {
    existingLink.href = themeUrl;
  } else {
    const link = document.createElement("link");
    link.id = "theme-css";
    link.rel = "stylesheet";
    link.href = themeUrl;
    document.head.appendChild(link);
  }
};

// ThemeProvider
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  // Apply theme when changed
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("theme", theme);

    // Tailwind class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // PrimeReact theme
    applyPrimeTheme(theme);
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
