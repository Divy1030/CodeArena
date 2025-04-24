import React from "react";

interface LabelButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "filled" | "outlined" | "text";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function LabelButton({
  type = "button",
  variant = "filled",
  disabled = false,
  className = "",
  children,
  onClick,
}: LabelButtonProps) {
  // Define styles based on variant
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantStyles = {
    filled: "bg-blue-600 text-white hover:bg-blue-700",
    outlined: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    text: "text-blue-600 hover:bg-blue-50",
  };
  
  const disabledStyle = "opacity-50 cursor-not-allowed";
  
  const buttonStyle = `${baseStyle} ${variantStyles[variant]} ${
    disabled ? disabledStyle : ""
  } ${className}`;

  return (
    <button
      type={type}
      className={buttonStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}