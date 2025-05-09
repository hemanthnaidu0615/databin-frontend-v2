import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import Logo from "../images/logo.png";
import AppMobileRightSidebar from ".//AppMobileRightSidebar";


import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { useDispatch } from "react-redux";
import { setDates } from "../store/dateRangeSlice";

const AppHeader: React.FC = () => {
 
  const [enterpriseKey, setEnterpriseKey] = useState("AWW");
  const enterpriseKeys = ["ABC", "XYZ", "PQR"];
  const calendarRef = useRef<any>(null);

  const {
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    screenSize,
    toggleMobileRightSidebar,
  } = useSidebar();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState<[Date, Date] | null>([
    new Date("2025-03-19"),
    new Date("2025-03-20"),
  ]);

  const hideCalendarRoutes = ["/scheduler"];
  const hideEnterpriseKeyRoutes = ["/inventory", "/scheduler"];

  const shouldHideCalendar = hideCalendarRoutes.includes(location.pathname);
  const shouldHideEnterpriseKey = hideEnterpriseKeyRoutes.includes(
    location.pathname
  );

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };



  const handleDateChange = (e: any) => {
    const newDates = e.value;
    setDateRange(newDates);
    if (Array.isArray(newDates) && newDates[0] && newDates[1]) {
      dispatch(setDates(newDates)); // ✅ Redux update
      calendarRef.current?.hide?.(); // ✅ Optional hide
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[99999] w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 backdrop-blur supports-backdrop-blur:bg-white/95 dark:supports-backdrop-blur:bg-gray-900/90">
        <div className="flex items-center justify-between w-full flex-nowrap gap-3 px-3 py-3 overflow-x-auto lg:px-6 lg:py-4">
          {/* Sidebar Toggle and Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11"
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

            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 lg:hidden md:hidden"
            >
              <img className="dark:hidden w-6 h-6" src={Logo} alt="Logo" />
              <img
                className="hidden dark:block w-6 h-6"
                src={Logo}
                alt="Logo"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Data-Bin
              </span>
            </Link>
          </div>

          {/* Right Side Utilities */}
          {screenSize !== "mobile" ? (
            <div className="flex items-center flex-nowrap gap-3 w-auto min-w-0 shrink-0">
              {!shouldHideCalendar && (
                <Calendar
                  ref={calendarRef}
                  value={dateRange}
                  selectionMode="range"
                  onChange={handleDateChange}
                  dateFormat="yy-mm-dd"
                  placeholder="Select Date Range"
                  className="w-[275px]"
                  inputClassName="text-sm dark:bg-gray-900 dark:text-white"
                  panelClassName="dark:bg-gray-900 dark:text-white z-50"
                  showIcon
                  hideOnDateTimeSelect
                  hideOnRangeSelection
                />
              )}

              {!shouldHideEnterpriseKey && (
                <select
                  value={enterpriseKey}
                  onChange={(e) => setEnterpriseKey(e.target.value)}
                  className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm"
                >
                  {enterpriseKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              )}

              <ThemeToggleButton />
              <NotificationDropdown />
              <UserDropdown />
            </div>
          ) : (
            <button
              onClick={toggleMobileRightSidebar}
              className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Open Right Sidebar"
            >
              <i className="pi pi-sliders-h" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Right Sidebar */}
      <AppMobileRightSidebar />
    </>
  );
};

export default AppHeader;
