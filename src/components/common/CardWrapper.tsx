import React from "react";
import clsx from "clsx";

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-900 shadow rounded-2xl p-4 h-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
