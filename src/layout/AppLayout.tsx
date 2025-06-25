import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./Navbar";
import AppSidebar from "./AppSidebar";
import Footer from "./Footer";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const desktopMargin =
    isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]";
  const mobileReset = isMobileOpen ? "ml-0" : "";

  return (
    <div className="relative min-h-screen">
      {/* Header (fixed) */}
      <div className="fixed inset-x-0 top-0 z-40">
        <AppHeader />
      </div>

      {/* Flex row: sidebar + main */}
      <div className="flex">
        <AppSidebar />

        {/* Main area */}
        <main
          className={`
            flex-1 pt-[var(--navbar-height)]
            transition-all duration-300 ease-in-out
            ${desktopMargin} ${mobileReset}
          `}
        >
          <div
            className="
              pt-4 pr-4 pb-4 pl-0
              md:pt-6 md:pr-6 md:pb-6 md:pl-0
              mx-auto max-w-[--breakpoint-2xl]
            "
          >
            <div className="page-container">
              <Outlet />
            </div>
          </div>
          <Footer/>
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);

export default AppLayout;