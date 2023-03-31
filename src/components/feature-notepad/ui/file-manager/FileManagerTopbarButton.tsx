import { MouseEventHandler } from "react";
import { IconType } from "react-icons";
import { Tooltip } from "@mui/material";

// Button styling
const buttonStyle = `button text-lg`;
const disabledButotnStyle = `cursor-not-allowed	opacity-50 text-lg`;

// Input props
interface FileManagerTopbarButtonProps {
  Icon: IconType;
  onClick: MouseEventHandler<SVGElement>;
  label: string;
  disabled?: boolean;
  disabledMessage?: string;
}

export default function FileManagerTopbarButton({
  Icon,
  onClick,
  label,
  disabled = false,
  disabledMessage,
}: FileManagerTopbarButtonProps) {
  return (
    <div className={disabled ? disabledButotnStyle : buttonStyle}>
      <Tooltip title={disabled ? `${label} - ${disabledMessage}` : label} arrow>
        <div>
          <Icon className="text-lg" onClick={!disabled ? onClick : undefined} />
        </div>
      </Tooltip>
    </div>
  );
}
