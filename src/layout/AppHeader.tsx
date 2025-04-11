import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import Logo from "../images/logo.png";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [enterpriseKey, setEnterpriseKey] = useState("AWW");
  const enterpriseKeys = ["ABC", "XYZ", "PQR"];
  const calendarRef = useRef<any>(null);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const handleDateChange = (e: any) => {
    setDateRange(e.value);
    if (Array.isArray(e.value) && e.value[0] && e.value[1]) {
      calendarRef.current?.hide?.();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        // Future shortcut logic
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[99999] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* Left Section */}
        <div className="flex items-center justify-between  gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Sidebar Toggle */}
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-[99999] dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="10" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 0 1 1.06-1.06L12 10.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L13.06 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L10.94 12 6.22 7.28z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="18" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583 1a.75.75 0 0 1 .75-.75h13.334a.75.75 0 1 1 0 1.5H1.333a.75.75 0 0 1-.75-.75zM0.583 11a.75.75 0 0 1 .75-.75h13.334a.75.75 0 1 1 0 1.5H1.333a.75.75 0 0 1-.75-.75zM1.333 5.25a.75.75 0 0 0 0 1.5h6.667a.75.75 0 1 0 0-1.5H1.333z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img className="dark:hidden" src={Logo} alt="Logo" />
            <img className="hidden dark:block" src={Logo} alt="Logo" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Data-Bin
            </span>
          </Link>

          {/* Application Menu Toggle */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-[99999] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <i className="pi pi-bars" />
          </button>
        </div>

        {/* Right Section */}
        <div
  className={`${
    isApplicationMenuOpen ? "flex" : "hidden"
  } flex-nowrap items-center justify-start w-full gap-4 px-3 py-3 shadow-theme-md sm:flex sm:justify-between sm:px-4 md:px-6 md:justify-center lg:justify-end lg:flex lg:shadow-none`}
>


          <div className="flex flex-wrap gap-3 w-full sm:w-auto sm:items-center">
            {/* Calendar Date Range Picker */}
            <Calendar
              ref={calendarRef}
              value={dateRange}
              selectionMode="range"
              onChange={handleDateChange}
              dateFormat="yy-mm-dd"
              placeholder="Select Date Range"
              className="w-full sm:w-[220px]"
              inputClassName="text-sm dark:bg-gray-900 dark:text-white"
              panelClassName="dark:bg-gray-900 dark:text-white z-50"
              showIcon
            />

            {/* Enterprise Key Dropdown */}
            <select
              value={enterpriseKey}
              onChange={(e) => setEnterpriseKey(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm"
            >
              {enterpriseKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <ThemeToggleButton />
            <NotificationDropdown />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
