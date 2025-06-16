import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { JSX } from "react";

type Props = {
  onClick: () => void;
  showMobile?: boolean;
  showDesktop?: boolean;
  text?: string;
  className?: string;
};                     
type ButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  text: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "auth";
};
type TabButtonProps = {
  label: string;
  icon?: JSX.Element;
  active?: boolean;
  onClick: () => void;
  className?: string;
};
type ActionButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  icon?: JSX.Element;
};


const ResponsiveViewMoreButton = ({
  onClick,
  showMobile = true,
  showDesktop = true,
  text = "View more",
  className = "",
}: Props) => (
  <>
    {showMobile && (
      <button
        onClick={onClick}
        className={`sm:hidden text-purple-600 text-sm font-medium self-start ${className}`}
      >
        <FontAwesomeIcon
          icon={faShareFromSquare}
          size="lg"
          style={{ color: "#a855f7" }}
        />
      </button>
    )}

    {showDesktop && (
      <button
        onClick={onClick}
        className={`hidden sm:block text-xs font-medium text-purple-600 hover:underline ${className}`}
      >
        {text}
      </button>
    )}
  </>
);                                    
export const CommonButton = ({
  onClick,
  type = "button",
  text,
  loading = false,
  disabled = false,
  className = "",
  variant = "primary",
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const baseStyles = `
    px-4 py-2 rounded text-sm text-white transition
    border-0 shadow-none outline-none
    focus:ring-0 focus:outline-none
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

    let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles = "px-4 py-2 rounded bg-[#9614d0] hover:bg-[#a855f7]";
      break;
    case "secondary":
      variantStyles = "px-4 py-2 rounded bg-[#a855f7] hover:bg-[#9614d0]";
      break;
    case "auth":
      variantStyles = `
        w-full py-2 px-4 rounded-md bg-[#a855f7]
        transition duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg active:scale-100 active:shadow-sm
      `;
      break;
  }                                              
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${variantStyles} ${baseStyles}`}
    >
      {loading ? "Processing..." : text}
    </button>
  );
};

export const TabSwitchButton = ({
  label,
  icon,
  active = false,
  onClick,
  className = "",
}: TabButtonProps) => {
  const activeStyles = active
    ? "bg-[#8b9eff] text-black"
    : "bg-transparent text-gray-300 border border-[#8b9eff] hover:bg-[#2a2e45]";

  return (
    <button
      onClick={onClick}
      style={{
        background: "#a855f7",
        border: "none",
        color: "white",
        transition: "none",
      }}
      className={`w-full md:w-auto px-5 py-3 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${activeStyles} ${className}`}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
export const ActionButton = ({
  text,
  onClick,
  style = {},
  icon,
}: ActionButtonProps) => {
  const mergedStyle: React.CSSProperties = {
    backgroundColor: "#a855f7",
    border: "none",
    color: "white",
    transition: "none", 
    ...style,
  };

  return (
    <button
      onClick={onClick}
      style={mergedStyle}
      className="bg-[#9C27B0] hover:brightness-90 text-white font-semibold py-3 px-6 rounded-lg w-full shadow-md hover:shadow-lg transition duration-200"
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};


export default ResponsiveViewMoreButton;
