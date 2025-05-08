import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-screen bg-white dark:bg-gray-900 p-6 sm:p-0">
      {children}
    </div>
  );
}
