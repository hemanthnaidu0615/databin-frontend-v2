import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./Navbar";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="relative min-h-screen">
      {/* Navbar - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <AppHeader />
      </div>

      {/* Sidebar - fixed below Navbar */}
      <aside
        className={`
          fixed top-20 left-0 h-[calc(100vh-64px)] z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"}
          ${isMobileOpen ? "w-[290px]" : "hidden lg:block"}
        `}
      >
        <AppSidebar />
      </aside>

      {/* Main content area - pushed by sidebar */}
      <main
        className={`
          pt-16
          transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}
          ${isMobileOpen ? "ml-0" : ""}
        `}
      >
        <div className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
