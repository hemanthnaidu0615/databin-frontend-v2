"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === null) return;

    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    applyPrimeTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (theme === null) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
