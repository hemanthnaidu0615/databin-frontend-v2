import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

type User = {
  id: number;
  role_id: number | null;
  role: string;
  token: string;
};

interface AppLayoutProps {
  user: User | null;
}

// Modify LayoutContent to accept the 'user' prop
const LayoutContent: React.FC<{ user: User | null }> = ({ user }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar  /> {/* Pass the user to AppSidebar */}
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader user={user} /> {/* Pass the user to AppHeader */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ user }) => {
  console.log('AppLayout user:', user);
  return (
    <SidebarProvider>
      <LayoutContent user={user} /> {/* Pass the user to LayoutContent */}
    </SidebarProvider>
  );
};

export default AppLayout;
