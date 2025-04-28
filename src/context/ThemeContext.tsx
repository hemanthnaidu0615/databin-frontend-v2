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

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply PrimeReact theme dynamically
const applyPrimeTheme = (theme: Theme) => {
  const themeName = theme === "dark" ? "lara-dark-indigo" : "lara-light-indigo";
  const themeUrl = `https://unpkg.com/primereact/resources/themes/${themeName}/theme.css`;

  let linkElement = document.getElementById("theme-css") as HTMLLinkElement | null;

  if (!linkElement) {
    linkElement = document.createElement("link");
    linkElement.id = "theme-css";
    linkElement.rel = "stylesheet";
    document.head.appendChild(linkElement);
  }

  linkElement.href = themeUrl;
};

// ThemeProvider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null); // Initially set to null for proper hydration

  // Load theme once on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (theme === null) return; // Wait until the theme is set

    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Tailwind dark class toggle
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // PrimeReact theme switch
    applyPrimeTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Loading state (avoid flickering on initial load)
  if (theme === null) {
    return <div>Loading...</div>; // Or a skeleton loader or any loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
