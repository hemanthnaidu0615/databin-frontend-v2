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
  screenSize: "mobile" | "tablet" | "desktop"; // ✅ Already added
  isMobileRightOpen: boolean; // ✅ NEW
  toggleMobileRightSidebar: () => void; // ✅ NEW
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

  // ✅ State for right-side mobile sidebar
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  const toggleMobileRightSidebar = () => {
    setIsMobileRightOpen((prev) => !prev);
  };

  // Use the custom hook to check for mobile screens
  const isMobile = useIsMobile();

  // ✅ New: screenSize state
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    window.innerWidth < 768
      ? "mobile"
      : window.innerWidth < 1024
      ? "tablet"
      : "desktop"
  );

  // ✅ New: Update screenSize on resize
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Effect to update mobile state when the screen size changes
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false); // Ensure left sidebar is closed on large screens
      setIsMobileRightOpen(false); // ✅ Also close right sidebar
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
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        screenSize, // ✅ Passed in context
        isMobileRightOpen, // ✅ NEW
        toggleMobileRightSidebar, // ✅ NEW
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
