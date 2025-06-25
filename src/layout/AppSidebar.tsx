import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  CopyIcon,
  GridIcon,
  PieChartIcon,
  TableIcon,
  UserManagementIcon,
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
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <BoxCubeIcon />, name: "Orders", path: "/orders" },
  { icon: <CalenderIcon />, name: "Fulfillment", path: "/fulfillment" },
  {
    icon: <CopyIcon />,
    name: "Sales",
    subItems: [
      { name: "Dashboard", path: "sales-dashboard" },
      { name: "Region", path: "sales-region" },
      { name: "Analysis", path: "sales-analysis" },
      { name: "Flow", path: "sales-flow" },
    ],
  },
  { icon: <BoxCubeIcon />, name: "Inventory", path: "/inventory" },
  { icon: <PieChartIcon />, name: "Shipments", path: "/shipment" },
  { icon: <TableIcon />, name: "Reports & Scheduler", path: "/scheduler" },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
    screenSize,
    isPinned,
    togglePin
  } = useSidebar();
  const location = useLocation();
  const [roleLevel, setRoleLevel] = useState<string | null>(null);
  const [manuallyToggled, setManuallyToggled] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });
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
      ? [
        {
          icon: <UserManagementIcon />,
          name: "User Management",
          path: "usermanagement",
        },
      ]
      : []),
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileOpen
      ) {
        toggleMobileSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, toggleMobileSidebar]);

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
    if (screenSize === "mobile" || screenSize === "tablet") {
      toggleMobileSidebar();
    }
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size ${openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.index === index
                    ? "rotate-180 text-gray-800 dark:text-white"
                    : "text-gray-800 dark:text-white"
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                onClick={handleLinkClick}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
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
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      onClick={handleLinkClick}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
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
      ref={sidebarRef}
      className={`
    flex flex-col
    bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
    transition-all duration-300 ease-in-out
    fixed left-0 top-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height))] z-40
    ${isMobileOpen || isExpanded || isHovered ? "w-[290px]" : "w-[90px]"}
            ${isMobileOpen
          ? "fixed top-16 left-0 w-[290px] h-[calc(100vh-64px)] z-50"
          : "hidden lg:flex"
        }
      `}
      onMouseEnter={() => {
        if (!isPinned) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isPinned) setIsHovered(false);
      }}
    >
      {/* Arrow Toggle Button */}
      <button
        onClick={togglePin}
        className="
    absolute top-1/2 right-[-12px] transform -translate-y-1/2 
    w-6 h-6 rounded-full shadow bg-white dark:bg-gray-800 border border-gray-300 
    flex items-center justify-center z-50
  "
        title={isPinned ? "Collapse Sidebar" : "Pin Sidebar"}
      >
        <span className="text-xs text-gray-800 dark:text-white">
          {isPinned ? "<" : ">"}
        </span>
      </button>
      {/* Sidebar inner content */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-2">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                } px-5`}
              >
                {/* Optional title */}
              </h2>
 
              {/* ✅ Apply internal padding here so it doesn’t interfere with full-width backgrounds */}
              <div className="flex flex-col gap-4 px-2">
                {renderMenuItems(navItems)}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
