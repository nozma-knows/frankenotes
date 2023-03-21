import React from "react";
import {
  FieldValues,
  FieldErrors,
  Control,
  Controller,
  Validate,
} from "react-hook-form";
import { TextField as MUITextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import queryNotesTheme from "../themes/QueryNotesTheme";

// TextField Props
interface TextFieldProps {
  control: Control<FieldValues>;
  name: string;
  type: string;
  placeholder: string;
  required?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  autocomplete?: string;
  validate?: Validate<any, any>;
  disabled?: boolean;
  errors?: FieldErrors;
  color?:
    | ("primary" | "secondary" | "error" | "info" | "success" | "warning")
    | undefined;
}

export default function NoStyleTextfield({
  control,
  name,
  type,
  placeholder,
  required,
  pattern,
  multiline,
  minRows = 1,
  maxRows,
  validate,
  disabled = false,
  errors,
  color = "primary",
}: TextFieldProps) {
  return (
    <ThemeProvider theme={queryNotesTheme}>
      <div className={`w-full`}>
        <Controller
          name={name}
          control={control}
          rules={{ required, pattern, validate }}
          render={({ field }) => {
            return (
              <MUITextField
                className="flex w-full"
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                color={errors && errors[name] ? "error" : color}
                multiline={multiline}
                minRows={minRows}
                maxRows={maxRows}
              />
            );
          }}
        />
      </div>
    </ThemeProvider>
  );
}
