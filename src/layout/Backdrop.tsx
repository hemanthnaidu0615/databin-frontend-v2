import { useSidebar } from "../context/SidebarContext";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 transition-opacity duration-300 lg:hidden"
      onClick={toggleMobileSidebar}
      role="presentation" // Avoid screen readers from reading the backdrop content
      aria-hidden="true" // Indicate that the backdrop is just a visual overlay
    />
  );
};

export default Backdrop;
