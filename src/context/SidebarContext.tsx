import { createContext, useContext, useState, useEffect } from "react";

// Define the SidebarContextType for type safety
type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};

// Create the SidebarContext
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Custom hook to access the SidebarContext
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Custom hook to detect if the screen is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initialize based on the current window size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

// SidebarProvider component that provides context to its children
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Check localStorage to persist the sidebar state
  const savedIsExpanded = localStorage.getItem("isExpanded") === "true";
  const savedIsMobileOpen = localStorage.getItem("isMobileOpen") === "true";

  // State for sidebar
  const [isExpanded, setIsExpanded] = useState(savedIsExpanded || false);
  const [isMobileOpen, setIsMobileOpen] = useState(savedIsMobileOpen || false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Use the custom hook to check for mobile screens
  const isMobile = useIsMobile();

  // Effect to update mobile state when the screen size changes
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false); // Ensure sidebar is closed on large screens
    }
  }, [isMobile]);

  // Store sidebar state in localStorage
  useEffect(() => {
    localStorage.setItem("isExpanded", JSON.stringify(isExpanded));
    localStorage.setItem("isMobileOpen", JSON.stringify(isMobileOpen));
  }, [isExpanded, isMobileOpen]);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded, // Adjust based on mobile state
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
