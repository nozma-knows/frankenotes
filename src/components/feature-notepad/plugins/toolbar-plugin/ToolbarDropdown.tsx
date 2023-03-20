import { Tooltip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/components/ui/form-fields/ToolbarTheme";

// interface ToolbarDropdownProps {
//   id: string;
//   label: string;
//   options: {
//     label: string;
//     value: string | number;
//     Icon: any;
//   }[];
//   onChange: (value: any) => void;
// }
interface ToolbarDropdownProps {
  id: string;
  label: string;
  options: {
    label: any;
    value: string | number;
    // Icon: any;
  }[];
  onChange: (value: any) => void;
}

export default function ToolbarDropdown({
  id,
  label,
  options,
  onChange,
}: ToolbarDropdownProps) {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex w-full">
        <Tooltip title={label} arrow>
          <Autocomplete
            id={id}
            options={options}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={label}
                className="flex"
              />
            )}
            onChange={(event, value) => onChange(value)}
          />
        </Tooltip>
      </div>
    </ThemeProvider>
  );
}
