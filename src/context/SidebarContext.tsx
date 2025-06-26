import { createContext, useContext, useState, useEffect } from "react";
 
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
  screenSize: "mobile" | "tablet" | "desktop";
  isMobileRightOpen: boolean;
  toggleMobileRightSidebar: () => void;
  isPinned: boolean;
  togglePin: () => void;
};
 
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
 
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
 
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
 
    handleResize();
    window.addEventListener("resize", handleResize);
 
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
 
  return isMobile;
};
 
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
 
  const savedIsPinned = localStorage.getItem("isPinned") === "true";
  const savedIsMobileOpen = localStorage.getItem("isMobileOpen") === "true";
 
  const [isPinned, setIsPinned] = useState(savedIsPinned || false); // ✅ NEW
  const [isMobileOpen, setIsMobileOpen] = useState(savedIsMobileOpen || false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);
 
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    window.innerWidth < 768
      ? "mobile"
      : window.innerWidth < 1024
      ? "tablet"
      : "desktop"
  );
 
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
 
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
      setIsMobileRightOpen(false);
    }
  }, [isMobile]);
 
  
  useEffect(() => {
    localStorage.setItem("isPinned", JSON.stringify(isPinned));
    localStorage.setItem("isMobileOpen", JSON.stringify(isMobileOpen));
  }, [isPinned, isMobileOpen]);
 
  const toggleSidebar = () => {
    setIsPinned((prev) => !prev);
  };
 
  const togglePin = () => {
    setIsPinned((prev) => !prev);
  };
 
  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => {
      if (!prev) setIsMobileRightOpen(false);
      return !prev;
    });
  };
 
  const toggleMobileRightSidebar = () => {
    setIsMobileRightOpen((prev) => {
      if (!prev) setIsMobileOpen(false);
      return !prev;
    });
  };
 
  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };
 
  return (
<SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isPinned,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar, 
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        screenSize,
        isMobileRightOpen,
        toggleMobileRightSidebar,
        isPinned,
        togglePin,
      }}
>
      {children}
</SidebarContext.Provider>
  );
};