// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { IconButton } from "@mui/material";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { useSidebar } from "../context/SidebarContext";
// import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
// import NotificationDropdown from "../components/header/NotificationDropdown";
// import UserDropdown from "../components/header/UserDropdown";

// const AppHeader: React.FC = () => {
//   const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Function to toggle sidebar
//   const handleToggle = () => {
//     if (window.innerWidth >= 991) {
//       toggleSidebar(); // Toggle sidebar on larger screens
//     } else {
//       toggleMobileSidebar(); // Toggle mobile sidebar
//     }
//   };

//   // Function to toggle the application menu dropdown
//   const toggleApplicationMenu = () => {
//     setApplicationMenuOpen(!isApplicationMenuOpen);
//   };

//   // Listen for Cmd/Ctrl + K to focus on search input
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if ((event.metaKey || event.ctrlKey) && event.key === "k") {
//         event.preventDefault();
//         inputRef.current?.focus();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <header className="sticky top-0 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 z-[99999]">
//       <div className="flex flex-col lg:flex-row items-center justify-between w-full px-4 lg:px-6 py-3">
//         {/* Mobile Sidebar Toggle Button */}
//         <button
//           className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-lg border dark:border-gray-800"
//           onClick={handleToggle}
//           aria-label="Toggle Sidebar"
//         >
//           {isMobileOpen ? (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
//                 fill="currentColor"
//               />
//             </svg>
//           ) : (
//             <svg
//               width="16"
//               height="12"
//               viewBox="0 0 16 12"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M0.583 1C0.583 0.5858 0.919 0.25 1.333 0.25H14.667C15.081 0.25 15.417 0.5858 15.417 1C15.417 1.4142 15.081 1.75 14.667 1.75H1.333C0.919 1.75 0.583 1.4142 0.583 1ZM0.583 11C0.583 10.5858 0.919 10.25 1.333 10.25H14.667C15.081 10.25 15.417 10.5858 15.417 11C15.417 11.4142 15.081 11.75 14.667 11.75H1.333C0.919 11.75 0.583 11.4142 0.583 11ZM1.333 5.25C0.919 5.25 0.583 5.5858 0.583 6C0.583 6.4142 0.919 6.75 1.333 6.75H8C8.414 6.75 8.75 6.4142 8.75 6C8.75 5.5858 8.414 5.25 8 5.25H1.333Z"
//                 fill="currentColor"
//               />
//             </svg>
//           )}
//         </button>

//         {/* Logo */}
//         <Link to="/" className="flex items-center lg:mr-4">
//           <img className="h-10 dark:hidden mr-2" src="./images/logo/logo.svg" alt="Logo" />
//           <img className="hidden h-10 dark:block mr-2" src="./images/logo/logo-dark.svg" alt="Logo" />
//           <h3 className="font-bold text-2xl">
//             Data<span className="text-violet-800"> Bin</span>
//           </h3>
//         </Link>

//         {/* Application Menu Toggle Button */}
//         <button
//           onClick={toggleApplicationMenu}
//           className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
//         >
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M6 10.5C6.83 10.5 7.5 11.17 7.5 12C7.5 12.83 6.83 13.5 6 13.5C5.17 13.5 4.5 12.83 4.5 12C4.5 11.17 5.17 10.5 6 10.5ZM18 10.5C18.83 10.5 19.5 11.17 19.5 12C19.5 12.83 18.83 13.5 18 13.5C17.17 13.5 16.5 12.83 16.5 12C16.5 11.17 17.17 10.5 18 10.5ZM13.5 12C13.5 11.17 12.83 10.5 12 10.5C11.17 10.5 10.5 11.17 10.5 12C10.5 12.83 11.17 13.5 12 13.5C12.83 13.5 13.5 12.83 13.5 12Z"
//               fill="currentColor"
//             />
//           </svg>
//         </button>

//         {/* Right Side: Edit Button, Notifications, Theme Toggle, User Dropdown */}
//         <div className="flex items-center gap-3">
//           <IconButton color="primary" onClick={() => navigate("/widget-setup")}>
//             <EditOutlinedIcon />
//           </IconButton>
//           <NotificationDropdown />
//           <ThemeToggleButton />
//           <UserDropdown />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AppHeader;



import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // Import Edit icon
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import Logo from "../images/logo.png";


const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to toggle the sidebar
  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // Function to toggle the application menu dropdown
  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // Listen for Cmd/Ctrl + K to focus on search input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[99999] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Mobile Sidebar Toggle Button */}
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-[99999] dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img
              className="dark:hidden"
              src={Logo}
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src={Logo}
              alt="Logo"
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Data-Bin
            </span>
          </Link>

          {/* Application Menu Button */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-[99999] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Search Input on Large Screens */}
          <div className="hidden lg:block w-[430px]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        {/* Right Side Menu */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
            {/* Edit Button */}
            <IconButton color="primary" onClick={() => navigate("/widget-setup")}>
              <EditOutlinedIcon />
            </IconButton>
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
