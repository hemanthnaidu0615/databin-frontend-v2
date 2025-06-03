import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios";
import { useSidebar } from "../../context/SidebarContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{ fullName: string; email: string } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const { toggleMobileRightSidebar, screenSize } = useSidebar(); // ✅ Access sidebar control

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    closeDropdown();
    if (screenSize === "mobile") toggleMobileRightSidebar(); // ✅ Close sidebar only on mobile

    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDropdownAction = () => {
    closeDropdown();
    if (screenSize === "mobile") {
      toggleMobileRightSidebar(); // ✅ Close sidebar after action on mobile only
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });

        const data = response.data as { fullName?: string; email?: string };

        setUserData({
          fullName: data.fullName || "John Doe",
          email: data.email || "unknown@example.com",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUser();
  }, []);

  function toggleDropdown() {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 260;
      const spaceOnRight = window.innerWidth - rect.left;
      const left =
        spaceOnRight < dropdownWidth
          ? Math.max(window.innerWidth - dropdownWidth - 16, 16)
          : rect.left;

      setPosition({
        top: rect.bottom + window.scrollY,
        left,
        });
    }
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-2 flex items-center justify-center bg-purple-700 text-white rounded-full h-8 w-8 text-sm font-medium">
          {userData?.email ? userData.email.charAt(0).toUpperCase() : "U"}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {userData?.email
            ? userData.email.split("@")[0].charAt(0).toUpperCase() +
              userData.email.split("@")[0].slice(1)
            : "User"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="z-[100010] w-[260px]"
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
            }}
          >
            <div className="flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
              <div>
                <span className="block mr-1 font-medium text-theme-sm">
                  {userData?.email
                    ? userData.email.split("@")[0].charAt(0).toUpperCase() +
                      userData.email.split("@")[0].slice(1)
                    : "User"}
                </span>
                <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                  {userData?.email || "john@example.com"}
                </span>
              </div>

              <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                <li>
                  <Link
                    to="/profile"
                    onClick={handleDropdownAction}
                    className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    View profile
                  </Link>
                </li>
                <li>
                  {/* <Link
                    to="/AccountSettings"
                    onClick={handleDropdownAction}
                    className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    Account settings
                  </Link> */}
                </li>
                {/* <li>
                  <Link
                    to="/Support"
                    onClick={handleDropdownAction}
                    className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    Support
                  </Link>
                </li> */}
              </ul>

              <Link
                to="/signin"
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Sign out
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
