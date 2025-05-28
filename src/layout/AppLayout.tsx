import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./Navbar";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <AppHeader />

      {/* Container that starts BELOW the Navbar */}
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"}
          ${isMobileOpen ? "fixed top-16 left-0 w-[290px] h-[calc(100vh-64px)] z-50" : "hidden lg:block"}`}
        >
          <AppSidebar />
          <Backdrop />
          {/* <Backdrop /> */}
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6
          transition-all duration-300 ease-in-out
          ${isExpanded || isHovered ? "lg:ml-0" : "lg:ml-0"}`}
        >
          <Outlet />
        </main>
      </div>
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
