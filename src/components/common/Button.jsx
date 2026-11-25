import { SaveIcon, Eraser, X } from "lucide-react";
import React, { useEffect } from "react";

const base = "px-2 py-1 rounded font-medium transition focus:outline-none";
const variants = {
  primary: "bg-(--primary-color) text-white hover:bg-(--primary-dark) disabled:opacity-50 cursor-not-allowed",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-300 cursor-not-allowed",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 cursor-not-allowed",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 cursor-not-allowed",
  custom: ""
};
const iconButton =
  "p-2 rounded-full bg-transparent hover:bg-gray-100 focus:outline-none flex items-center justify-center";

const keyMap = {
  save: { key: "F10", icon: <SaveIcon className="w-4" /> },
  clear: { key: "F9", icon: <Eraser className="w-4" /> },
  cancel: { key: "Escape", icon: <X className="w-4" /> },
  close: { key: "Escape", icon: <X className="w-4" /> },
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  startIcon,
  endIcon,
  buttonType,
  onKeyShortcut,
  onClick,
  loading,
  disabled,
  ...props
}) => {
  const isIcon = type === "icon";
  useEffect(() => {
    if (!buttonType || !keyMap[buttonType]) return;
    const handler = (e) => {
      if (
        (keyMap[buttonType].key === "Escape" && e.key === "Escape") ||
        (keyMap[buttonType].key !== "Escape" &&
          e?.key?.toUpperCase() === keyMap[buttonType]?.key)
      ) {
        e.preventDefault();
        if (onKeyShortcut) onKeyShortcut(e);
        else if (onClick) onClick(e);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [buttonType, onKeyShortcut, onClick]);

  const defaultIcon = buttonType && keyMap[buttonType]?.icon;
  const defaultkey = buttonType && keyMap[buttonType]?.key;

  const domProps = { ...props };
  delete domProps.loading;

  return (
    <button
      type={isIcon ? "button" : type}
      className={
        isIcon
          ? `${iconButton} ${className}`.trim()
          : `${base} ${className} ${
              variants[variant] || ""
            } flex items-center justify-center cursor-pointer`.trim()
      }
      onClick={onClick}
      disabled={disabled || loading}
      {...domProps}
    >
      {(startIcon || defaultIcon) && (
        <span className="mr-2 flex items-center space-x-2">
          {startIcon || defaultIcon}
          <span
            className={`w-px h-4 ${
              buttonType === "clear" ? "bg-black" : "bg-gray-300"
            }`}
          />
          {defaultkey && (
            <span>{defaultkey === "Escape" ? "ESC" : defaultkey}</span>
          )}
        </span>
      )}

      <span className="flex items-center">
        {loading ? "Loading..." : children}
      </span>
      {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
