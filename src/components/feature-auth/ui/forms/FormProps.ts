import { FieldValues } from "react-hook-form";

export interface FormProps {
  loading: boolean;
  onSubmit: (data: FieldValues) => void;
}
