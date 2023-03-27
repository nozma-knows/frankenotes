import React, { MouseEventHandler } from "react";
import { Tooltip } from "@mui/material";
import { IconType } from "react-icons";

export default function EditorButton({
  Icon,
  label,
  disabled,
  active = false,
  onClick,
  className,
  iconSize,
}: {
  Icon: IconType;
  label: string;
  disabled: boolean;
  active?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  iconSize?: string;
}) {
  return (
    <Tooltip title={label} arrow>
      <button
        disabled={disabled}
        onClick={onClick}
        type="button"
        className={
          className ||
          `${!disabled && "button"} bg-tertiary-dark p-2 rounded-lg`
        }
        aria-label={label}
      >
        <Icon
          className={`${iconSize || "text-2xl"}  ${
            active ? "text-secondary-dark" : "text-main-dark"
          }`}
        />
      </button>
    </Tooltip>
  );
}
