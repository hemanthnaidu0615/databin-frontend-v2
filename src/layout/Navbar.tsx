import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { useSidebar } from "../context/SidebarContext";
import { useScrollLock } from "../hooks/useScrollLock";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import UserDropdown from "../components/header/UserDropdown";
import Logo from "../images/logo.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDates } from "../store/dateRangeSlice";
import { setEnterpriseKey as setEnterpriseKeyRedux } from "../store/enterpriseKeySlice";
import { axiosInstance } from "../axios";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Navbar: React.FC = () => {
  const [enterpriseKey, setEnterpriseKey] = useState("All");
  const [enterpriseKeys, setEnterpriseKeys] = useState<string[]>([]);
  const calendarRef = useRef<any>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  const {
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    screenSize,
    isMobileRightOpen,
    toggleMobileRightSidebar,
  } = useSidebar();

  const reduxDates = useSelector((state: any) => state.dateRange.dates);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(() => {
    if (Array.isArray(reduxDates) && reduxDates[0] && reduxDates[1]) {
      return [new Date(reduxDates[0]), new Date(reduxDates[1])];
    }
    return null;
  });

  useScrollLock(isMobileRightOpen);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const hideCalendarRoutes = ["/scheduler", "/UserManagement"];
  const hideEnterpriseKeyRoutes = [
    "/inventory",
    "/scheduler",
    "/sales/flow",
    "/UserManagement",
  ];
  const shouldHideCalendar = hideCalendarRoutes.includes(location.pathname);
  const shouldHideEnterpriseKey = hideEnterpriseKeyRoutes.includes(
    location.pathname
  );

  useEffect(() => {
    const fetchEnterpriseKeys = async () => {
      try {
        const response = await axiosInstance.get(
          "/global-filter/enterprise-keys"
        );
        const keys =
          (response.data as { enterprise_keys: string[] }).enterprise_keys ||
          [];
        setEnterpriseKeys(["All", ...keys]);
      } catch (error) {
        console.error("Failed to fetch enterprise keys:", error);
        setEnterpriseKeys(["All"]);
      }
    };

    fetchEnterpriseKeys();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileRightOpen
      ) {
        toggleMobileRightSidebar(); // close the sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileRightOpen, toggleMobileRightSidebar]);

  useEffect(() => {
    dispatch(
      setEnterpriseKeyRedux(enterpriseKey === "All" ? "" : enterpriseKey)
    );
  }, [enterpriseKey]);

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
      dispatch(setDates(newDates));
      calendarRef.current?.hide?.();
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

  useLayoutEffect(() => {
  const updateHeight = () => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${headerRef.current.offsetHeight}px`
      );
    }
  };

  updateHeight(); // initial run

  window.addEventListener("resize", updateHeight); // resize watcher

  return () => window.removeEventListener("resize", updateHeight);
}, [location.pathname]);
  return (
    <>
      <header
        ref={headerRef}
        className={`
    sticky top-0 z-[40] w-full
    bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 backdrop-blur
    supports-backdrop-blur:bg-white/95 dark:supports-backdrop-blur:bg-gray-900/90
    transition-all duration-300 ease-in-out
    $
  `}
      >
        <div className="flex items-center justify-between w-full gap-3 px-3 py-3 overflow-x-auto lg:overflow-visible lg:px-6 lg:py-4">
          <div className="flex items-center gap-3 shrink-0">
            {/* Sidebar toggle button */}
            <button
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
              className={`flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 lg:hidden ${
                !isMobileOpen
                  ? "border border-gray-200 rounded-lg dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : ""
              }`}
            >
              {isMobileOpen ? (
                <span className="text-xl font-bold">✕</span>
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

            {/* ✅ Logo + Data-Bin text for desktop */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-3 shrink-0 "
            >
              {/* Light mode logo */}
              <img className="dark:hidden w-8 h-8" src={Logo} alt="Logo" />

              {/* Dark mode logo */}
              <img
                className="hidden dark:block w-6 h-6"
                src={Logo}
                alt="Logo"
              />
              <span className="text-xl font-semibold text-gray-900 dark:text-white leading-none flex items-center">
                Data-Bin
              </span>
            </Link>

            {/* ✅ Logo + Data-Bin text for mobile only - absolutely centered */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2 pointer-events-auto"
              >
                <img className="dark:hidden w-6 h-6" src={Logo} alt="Logo" />
                <img
                  className="hidden dark:block w-6 h-6"
                  src={Logo}
                  alt="Logo"
                />
                <span className="text-lg font-semibold text-gray-900 dark:text-white leading-none flex items-center">
                  Data-Bin
                </span>
              </Link>
            </div>
          </div>

          {screenSize == "desktop" ? (
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
                  icon={<i className="pi pi-calendar text-white" />}
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
              <UserDropdown />
            </div>
          ) : (
            <button
              onClick={toggleMobileRightSidebar}
              className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle Right Sidebar"
            >
              {isMobileRightOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <i className="pi pi-sliders-h" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* ✅ Mobile Right Sidebar Drawer Backdrop */}
      <div
        ref={sidebarRef}
        className={`
    fixed flex flex-col
    bg-white dark:bg-gray-900 shadow-lg z-[100000] border-l border-gray-200 dark:border-gray-800
    transition-transform duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
    ${isMobileRightOpen ? "translate-y-0" : "-translate-y-full"}
    ${isMobileRightOpen ? "top-16 right-0 w-72 h-[calc(100vh-64px)]" : "hidden"}
    lg:hidden overflow-y-auto
  `}
      >
        {/* <div className="flex justify-end p-4">
          <button
            onClick={toggleMobileRightSidebar}
            className="text-gray-600 dark:text-gray-300 text-xl"
          >
            ✕
          </button>
        </div> */}

        <div className="flex flex-col gap-4 px-4 pb-6">
          {!shouldHideCalendar && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Date Range
              </label>
              <Calendar
                ref={calendarRef}
                value={dateRange}
                selectionMode="range"
                onChange={(e) => {
                  const newDates = e.value;

                  if (
                    Array.isArray(newDates) &&
                    newDates.length === 2 &&
                    newDates[0] instanceof Date &&
                    newDates[1] instanceof Date
                  ) {
                    setDateRange([newDates[0], newDates[1]]);
                    dispatch(setDates([newDates[0], newDates[1]]));
                    calendarRef.current?.hide?.();
                    toggleMobileRightSidebar();
                  } else if (Array.isArray(newDates)) {
                    setDateRange(newDates as [Date, Date]);
                  } else {
                    setDateRange(null);
                  }
                }}
                dateFormat="yy-mm-dd"
                placeholder="Select Date Range"
                className="w-full"
                inputClassName="text-sm dark:bg-gray-900 dark:text-white"
                panelClassName="dark:bg-gray-900 dark:text-white z-50"
                appendTo="self"
                showIcon
              />
            </div>
          )}

          {!shouldHideEnterpriseKey && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Enterprise
              </label>
              <select
                value={enterpriseKey}
                onChange={(e) => {
                  setEnterpriseKey(e.target.value);
                  toggleMobileRightSidebar();
                }}
                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm"
              >
                {enterpriseKeys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="border-t border-gray-300 dark:border-gray-700" />

          {/*  Auto-close on theme toggle */}
          <div className="flex items-center justify-between gap-4 px-1 pt-2">
            <div
              onClick={() => {
                toggleMobileRightSidebar();
              }}
            >
              <ThemeToggleButton />
            </div>

            <UserDropdown />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
