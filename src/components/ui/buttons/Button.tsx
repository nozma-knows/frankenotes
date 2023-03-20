import React, { MouseEventHandler } from "react";
import PulseLoader from "react-spinners/PulseLoader";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  className?: string;
  secondary?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  onClick,
  label,
  className,
  secondary = false,
  loading,
  disabled = false,
}: ButtonProps) {
  const defaultLabel = "Select";

  return (
    <button onClick={onClick} disabled={disabled}>
      <div
        className={`${className} flex button p-4 rounded-xl button-primary 
        ${secondary && "button-secondary"}
        ${disabled && "button-disabled"} 
        ${className}`}
      >
        {loading ? (
          <PulseLoader color="#58335e" size={8} />
        ) : (
          <div className="font-semibold">{label || defaultLabel}</div>
        )}
      </div>
    </button>
  );
}
