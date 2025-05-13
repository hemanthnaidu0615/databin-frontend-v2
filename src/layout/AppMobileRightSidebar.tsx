import { Calendar } from "primereact/calendar";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { useState, useRef } from "react";
import { useSidebar } from "../context/SidebarContext";
import { useScrollLock } from "../hooks/useScrollLock";

const AppMobileRightSidebar = () => {
  const { isMobileRightOpen, toggleMobileRightSidebar } = useSidebar();
  const [dateRange, setDateRange] = useState<any>(null);
  const [enterpriseKey, setEnterpriseKey] = useState("AWW");
  const enterpriseKeys = ["ABC", "XYZ", "PQR"];
  const calendarRef = useRef<any>(null);
  useScrollLock(isMobileRightOpen);

  const handleDateChange = (e: any) => {
    setDateRange(e.value);
    if (Array.isArray(e.value) && e.value[0] && e.value[1]) {
      calendarRef.current?.hide?.();
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg z-[100000] transform transition-transform duration-300 ease-in-out ${
        isMobileRightOpen ? "translate-x-0" : "translate-x-full"
      } md:hidden overflow-y-auto`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleMobileRightSidebar}
          className="text-gray-600 dark:text-gray-300 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Date Range</label>
          <Calendar
            ref={calendarRef}
            value={dateRange}
            selectionMode="range"
            onChange={handleDateChange}
            dateFormat="yy-mm-dd"
            placeholder="Select Date Range"
            className="w-full"
            inputClassName="text-sm dark:bg-gray-900 dark:text-white"
            panelClassName="dark:bg-gray-900 dark:text-white z-50"
            appendTo="self"
            showIcon
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Enterprise</label>
          <select
            value={enterpriseKey}
            onChange={(e) => setEnterpriseKey(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm"
          >
            {enterpriseKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-700" />

        <div className="flex items-center justify-between gap-4 px-1 pt-2">
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default AppMobileRightSidebar;
