import React from "react";
 
const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400 mt-auto px-4 py-6">
      <div className="max-w-[--breakpoint-2xl] mx-auto text-center">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-gray-700 dark:text-gray-300 font-medium">DataBin</span>. A product by{" "}
          <a
            href="https://www.meridianit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            Meridian
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
 
export default Footer;