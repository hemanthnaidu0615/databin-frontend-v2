import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../images/logo.png";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  CopyIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserManagementIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { axiosInstance } from "../axios";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const baseNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Orders",
    path: "/orders"
  },
  {
    icon: <CalenderIcon />,
    name: "Fulfillment",
    path: "/fulfillment",
  },
  {
    icon: <CopyIcon />,
    name: "Sales",
    subItems: [
      { name: "Dashboard", path: "/sales/dashboard" },
      { name: "Region", path: "/sales/region" },
      { name: "Analysis", path: "/sales/analysis" },
      { name: "Flow", path: "/sales/flow" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Inventory",
    path: "/inventory",
  },
  {
    icon: <PieChartIcon />,
    name: "Shipments",
    path: "/shipment",
  },
  {
    icon: <TableIcon />,
    name: "Reports & Scheduler",
    path: "/scheduler",
  }
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
    screenSize
  } = useSidebar();
  const location = useLocation();
  const [roleLevel, setRoleLevel] = useState<string | null>(null);
  const [manuallyToggled, setManuallyToggled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", { withCredentials: true });
        const data = response.data as { roleLevel: string };
        setRoleLevel(data.roleLevel.toLowerCase());
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRoleLevel(null);
      }
    };

    fetchUserRole();
  }, []);

  const navItems: NavItem[] = [
    ...baseNavItems,
    ...(roleLevel === "admin" || roleLevel === "manager"
      ? [{ icon: <UserManagementIcon />, name: "User Management", path: "/UserManagement" }]
      : []),
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (manuallyToggled) return;

    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, manuallyToggled]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      const isSame = prevOpenSubmenu?.index === index;
      setManuallyToggled(true);
      return isSame ? null : { type: "main", index };
    });
  };

  const handleLinkClick = () => {
    if (screenSize === "mobile") {
      toggleMobileSidebar(); // ✅ close sidebar on mobile
    }
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                onClick={handleLinkClick}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      onClick={handleLinkClick}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/" className="flex items-center gap-2">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src={Logo} alt="Logo" width={32} height={32} />
              <img className="hidden dark:block" src={Logo} alt="Logo" width={32} height={32} />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Data-Bin</span>
            </>
          ) : (
            <img src={Logo} alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
