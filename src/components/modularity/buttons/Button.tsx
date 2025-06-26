import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { JSX } from "react";

type ButtonVariant = "primary" | "secondary" | "auth" | "tab" | "action" | "responsive";     // Add user || apply filters || Login || create and view schedular || save schedular || view more
type CommonButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
  icon?: JSX.Element;
  active?: boolean;
  showMobile?: boolean;
  showDesktop?: boolean;
  style?: React.CSSProperties;
};

const CommonButton = ({
  onClick,
  type = "button",
  text = "Click me",
  loading = false,
  disabled = false,
  className = "",
  variant = "primary",
  icon,
  active = false,
  showMobile = true,
  showDesktop = true,
  style = {},
}: CommonButtonProps) => {
  const isDisabled = disabled || loading;

  // Default base styles
  let baseStyle = `
    flex items-center justify-center gap-2
    font-semibold rounded transition-all
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // Variant-specific styles
  let variantStyle = "";

  switch (variant) {
    case "primary":
      variantStyle = "bg-[#a855f7] hover:bg-[#9614d0] px-4 py-2 text-white text-sm";
      break;
    case "secondary":
      variantStyle = "bg-[#a855f7] hover:bg-[#9614d0] px-4 py-2 text-white text-sm";
      break;
    case "auth":
      variantStyle = "w-full bg-[#a855f7] py-2 px-4 hover:scale-105 hover:shadow-lg active:scale-100 active:shadow-sm text-white";
      break;
    case "tab":
      baseStyle += " w-full md:w-auto px-5 py-3 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2";

      variantStyle = active
        ? "bg-[#a855f7] text-white border border-[#a855f7]"
        : "bg-[#a855f7] text-white border border-[#a855f7]";
      break;
    case "action":
      variantStyle = "bg-[#a855f7] hover:brightness-90 text-white py-3 px-6 w-full shadow-md hover:shadow-lg";
      break;
    case "responsive":
      return (
<>
  {showMobile && (
    <button
      onClick={onClick}
      className={`sm:hidden text-purple-600 text-sm font-medium self-start ${className}`}
      style={style}
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
      className={`hidden sm:block text-purple-600 text-sm font-medium ${className}`}
      style={style}
    >
      <FontAwesomeIcon
        icon={faShareFromSquare}
        size="lg"
        style={{ color: "#a855f7" }}
      />
    </button>
  )}
</>

      );

  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={style}
      className={`${variantStyle} ${baseStyle}`}
    >
      {loading ? "Processing..." : (
        <>
          {icon && <span>{icon}</span>}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default CommonButton;
