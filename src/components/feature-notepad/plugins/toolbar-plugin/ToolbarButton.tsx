import { Tooltip } from "@mui/material";
interface ToolbarButtonProps {
  disabled?: boolean;
  editor: any;
  command: any;
  property?: string;
  Icon: any;
  label?: string;
  active?: boolean;
}

export default function ToolbarButton({
  disabled,
  editor,
  command,
  property,
  Icon,
  label,
  active,
}: ToolbarButtonProps) {
  return (
    <Tooltip title={label} arrow>
      <button
        disabled={disabled}
        onClick={() => {
          editor.dispatchCommand(command, property);
        }}
        className={
          disabled
            ? `cursor-not-allowed	opacity-50 text-lg`
            : `button text-lg ${active ? "text-secondary-dark" : "text-white"}`
        }
      >
        <Icon />
      </button>
    </Tooltip>
  );
}
