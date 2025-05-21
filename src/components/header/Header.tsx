import { useState } from "react";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900 backdrop-blur supports-backdrop-blur:bg-white/95 dark:supports-backdrop-blur:bg-gray-900/90">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* Left Section */}
        <div className="flex items-center justify-between w-full gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-800 lg:border-b-0 lg:px-0 lg:py-5">
          {/* Sidebar Toggle Button */}
          <button
            className="flex items-center justify-center w-12 h-12 text-gray-600 rounded-lg dark:text-gray-400 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onToggle}
            aria-label="Toggle Sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 16 12" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583 1C0.583 0.586 0.919 0.25 1.333 0.25h13.333c.415 0 .75.336.75.75s-.336.75-.75.75H1.333c-.414 0-.75-.336-.75-.75zM0.583 11c0-.414.336-.75.75-.75h13.333c.415 0 .75.336.75.75s-.336.75-.75.75H1.333c-.414 0-.75-.336-.75-.75zM1.333 5.25c-.414 0-.75.336-.75.75s.336.75.75.75h6.667c.415 0 .75-.336.75-.75s-.336-.75-.75-.75H1.333z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Application Menu Toggle Button */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-12 h-12 text-gray-700 rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.5C6.83 10.5 7.5 11.17 7.5 12C7.5 12.83 6.83 13.5 6 13.5C5.17 13.5 4.5 12.83 4.5 12C4.5 11.17 5.17 10.5 6 10.5ZM18 10.5C18.83 10.5 19.5 11.17 19.5 12C19.5 12.83 18.83 13.5 18 13.5C17.17 13.5 16.5 12.83 16.5 12C16.5 11.17 17.17 10.5 18 10.5ZM13.5 12C13.5 11.17 12.83 10.5 12 10.5C11.17 10.5 10.5 11.17 10.5 12C10.5 12.83 11.17 13.5 12 13.5C12.83 13.5 13.5 12.83 13.5 12Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Right Section */}
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"
            } flex-wrap items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
        >
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
