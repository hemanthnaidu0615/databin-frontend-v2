import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext"; 
const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const { theme } = useTheme(); 

  if (!isMobileOpen) return null;

  // ✅ set overlay color based on current theme
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-300";

  return (
    <div
      className={`fixed inset-0 z-40 ${bgColor} bg-opacity-50 transition-opacity duration-300 lg:hidden`}
      onClick={toggleMobileSidebar}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export default Backdrop;
