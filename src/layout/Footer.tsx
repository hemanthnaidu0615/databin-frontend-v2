import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400 mt-auto px-4 py-6">
      <div className="max-w-[--breakpoint-2xl] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left section */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} DataBin. A product by <a className="underline" href="https://www.meridianit.com">Meridian</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
