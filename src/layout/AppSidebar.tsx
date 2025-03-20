// import { useCallback, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { GridIcon } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// import { useRef, useEffect } from "react";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     subItems: [{ name: "Dashboard", path: "/", pro: false }],
//   },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );

//   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
//   const [submenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // Handle submenu toggle
//   const handleSubmenuToggle = (index: number) => {
//     setOpenSubmenu((prevOpenSubmenu) =>
//       prevOpenSubmenu === index ? null : index
//     );
//   };

//   const sidebarWidth = isHovered || isExpanded ? "w-[250px]" : "w-[80px]";

//   // Dynamically adjust submenu height
//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   return (
//     <aside
//       className={`fixed top-0 left-0 mt-16 lg:mt-0 flex flex-col px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${isMobileOpen ? "translate-x-0 w-[250px]" : "lg:translate-x-0"} 
//         ${sidebarWidth}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className={`py-8 flex ${isExpanded || isHovered ? "justify-start" : "lg:justify-center"}`}>
//         <Link to="/" className="flex items-center">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img className="dark:hidden mr-2" src="../../ui/images/logo.png" alt="Logo" width={150} height={40} />
//               <img className="hidden dark:block mr-2" src="../../ui/images/logo.png" alt="Logo" width={150} height={40} />
//               <h3 className="font-bold text-2xl">
//                 Data<span className="text-violet-800"> Bin</span>
//               </h3>
//             </>
//           ) : (
//             <img src="../../ui/images/logo.png" alt="Logo" width={32} height={32} />
//           )}
//         </Link>
//       </div>

//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${isExpanded || isHovered ? "justify-start" : "lg:justify-center"}`}>
//                 {isExpanded || isHovered || isMobileOpen ? "Menu" : ""}
//               </h2>
//               <ul className="flex flex-col gap-4">
//                 {navItems.map((nav, index) => (
//                   <li key={nav.name}>
//                     {nav.subItems ? (
//                       <button
//                         onClick={() => handleSubmenuToggle(index)}
//                         className={`menu-item group ${openSubmenu === index ? "menu-item-active" : "menu-item-inactive"}`}
//                       >
//                         <span className={`menu-item-icon-size ${openSubmenu === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
//                           {nav.icon}
//                         </span>
//                         {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.subItems[0].name}</span>}
//                       </button>
//                     ) : (
//                       nav.path && (
//                         <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
//                           <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
//                             {nav.icon}
//                           </span>
//                           {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
//                         </Link>
//                       )
//                     )}
//                     {nav.subItems && (isExpanded || isHovered || isMobileOpen) && openSubmenu === index && (
//                       <div
//                         ref={(el) => {
//                           subMenuRefs.current[index] = el;
//                         }}
//                         className="overflow-hidden transition-all duration-300"
//                         style={{
//                           height: `${submenuHeight[index] || 0}px`,
//                         }}
//                       >
//                         <ul className="mt-2 space-y-1 ml-9">
//                           {nav.subItems.map((subItem) => (
//                             <li key={subItem.name}>
//                               <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
//                                 {subItem.name}
//                                 <span className="flex items-center gap-1 ml-auto">
//                                   {subItem.new && (
//                                     <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
//                                       new
//                                     </span>
//                                   )}
//                                   {subItem.pro && (
//                                     <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
//                                       pro
//                                     </span>
//                                   )}
//                                 </span>
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;
// function customUseRef<T>(arg0: {}) {
//   throw new Error("Function not implemented.");
// }


// import { useCallback, useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { GridIcon } from "../icons";
// import { useSidebar } from "../context/SidebarContext";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     subItems: [{ name: "Dashboard", path: "/", pro: false }],
//   },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   // Determine if the link is active
//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );

//   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
//   const [submenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // Handle submenu toggle
//   const handleSubmenuToggle = (index: number) => {
//     setOpenSubmenu((prevOpenSubmenu) =>
//       prevOpenSubmenu === index ? null : index
//     );
//   };

//   // Sidebar width based on expanded/hovered state
//   const sidebarWidth = isHovered || isExpanded ? "w-[250px]" : "w-[80px]";

//   // Dynamically adjust submenu height when it opens
//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   return (
//     <aside
//       className={`fixed top-0 left-0 mt-16 lg:mt-0 flex flex-col px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${isMobileOpen ? "translate-x-0 w-[250px]" : "lg:translate-x-0"} 
//         ${sidebarWidth}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className={`py-8 flex ${isExpanded || isHovered ? "justify-start" : "lg:justify-center"}`}>
//         <Link to="/" className="flex items-center">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               {/* <img className="dark:hidden mr-2" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} /> */}
//               {/* <h3 className="font-bold text-2xl">
//                 Data<span className="text-violet-800"> Bin</span>
//               </h3> */}
//               <img className="hidden dark:block mr-2" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />

//             </>
//           ) : (
//             <img src="/images/logo.png" alt="Logo" width={32} height={32} />
//           )}
//         </Link>
//       </div>

//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${isExpanded || isHovered ? "justify-start" : "lg:justify-center"}`}>
//                 {isExpanded || isHovered || isMobileOpen ? "Menu" : ""}
//               </h2>
//               <ul className="flex flex-col gap-4">
//                 {navItems.map((nav, index) => (
//                   <li key={nav.name}>
//                     {nav.subItems ? (
//                       <button
//                         onClick={() => handleSubmenuToggle(index)}
//                         className={`menu-item group ${openSubmenu === index ? "menu-item-active" : "menu-item-inactive"}`}
//                       >
//                         <span className={`menu-item-icon-size ${openSubmenu === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
//                           {nav.icon}
//                         </span>
//                         {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.subItems[0].name}</span>}
//                       </button>
//                     ) : (
//                       nav.path && (
//                         <Link to={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
//                           <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
//                             {nav.icon}
//                           </span>
//                           {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
//                         </Link>
//                       )
//                     )}
//                     {nav.subItems && (isExpanded || isHovered || isMobileOpen) && openSubmenu === index && (
//                       <div
//                         ref={(el) => {
//                           subMenuRefs.current[index] = el;
//                         }}
//                         className="overflow-hidden transition-all duration-300"
//                         style={{
//                           height: `${submenuHeight[index] || 0}px`,
//                         }}
//                       >
//                         <ul className="mt-2 space-y-1 ml-9">
//                           {nav.subItems.map((subItem) => (
//                             <li key={subItem.name}>
//                               <Link to={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
//                                 {subItem.name}
//                                 <span className="flex items-center gap-1 ml-auto">
//                                   {subItem.new && (
//                                     <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
//                                       new
//                                     </span>
//                                   )}
//                                   {subItem.pro && (
//                                     <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
//                                       pro
//                                     </span>
//                                   )}
//                                 </span>
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;


import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { GridIcon } from "../icons"; // Import your icon

const AppSidebar: React.FC = () => {
  const { isExpanded, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [toggleSidebar, setToggleSidebar] = useState(false); // State for toggling the sidebar on mobile
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    if (!submenuMatched) {
      setSubMenuHeight({});
    }
  }, [location, isActive]);

  useEffect(() => {
    if (subMenuHeight) {
      const key = `main-0`; // There is no submenu, so this stays as "main-0"
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [subMenuHeight]);

  // Define a simple navItems array with the "Dashboard" item only
  const navItems = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
      path: "/dashboard", // Link to the Dashboard
    },
  ];

  // Render the menu items (only "Dashboard" in this case)
  const renderMenuItems = (items: { icon: React.ReactNode; name: string; path: string }[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  // Sidebar width based on expanded/hovered state
  const sidebarWidth = isHovered || isExpanded ? "w-[250px]" : "w-[80px]";

  return (
    <div className="flex">
      <aside
        className={`fixed top-0 left-0 mt-16 lg:mt-0 flex flex-col px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
          ${toggleSidebar ? "translate-x-0" : "lg:translate-x-0 hidden lg:block"} 
          ${sidebarWidth}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`py-8 flex ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link to="/">
            {isExpanded || isHovered || toggleSidebar ? (
              <>
                <img
                  className="dark:hidden"
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  width={150}
                  height={40}
                />
                <img
                  className="hidden dark:block"
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  width={150}
                  height={40}
                />
              </>
            ) : (
              <img
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )}
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          {/* Dashboard Section */}
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || toggleSidebar ? "Dashboard" : null}
                </h2>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`menu-item group ${
                    isActive("/dashboard") ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive("/dashboard")
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    <GridIcon />
                  </span>
                  {(isExpanded || isHovered || toggleSidebar) && (
                    <span className="menu-item-text">Dashboard</span>
                  )}
                </Link>
              </div>
            </div>
          </nav>

          {/* Sidebar Widget (Optional) */}
          
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className="lg:hidden p-4"
          onClick={() => setToggleSidebar(!toggleSidebar)}
        >
          <span className="block w-6 h-1 bg-black mb-1"></span>
          <span className="block w-6 h-1 bg-black mb-1"></span>
          <span className="block w-6 h-1 bg-black"></span>
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          toggleSidebar ? "ml-[250px]" : "ml-0"
        }`}
      >
        {/* Add the rest of your content here, such as dashboard, etc. */}
      </main>
    </div>
  );
};

export default AppSidebar;
