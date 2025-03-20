import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="h-screen xl:flex">
      {/* Sidebar & Backdrop (No scrolling here) */}
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main Content Area (Only this should scroll) */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out overflow-y-auto h-screen ${
          isExpanded || isHovered ? "lg:ml-[250px]" : "lg:ml-[80px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />

        {/* Content Wrapper */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
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
