import React from "react";
import { IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void; // Optional remove function (only in Edit Mode)
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, onRemove }) => {
  return (
    <div 
      className="relative bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md 
                 border border-gray-200 dark:border-gray-800 transition-all space-y-2"
    >
      {/* Widget Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>

      {/* Widget Content */}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>

      {/* Remove Button (Only in Edit Mode) */}
      {onRemove && (
        <IconButton
          onClick={onRemove}
          aria-label="Remove widget"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "red",
          }}
        >
          <RemoveCircleOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default WidgetCard;
