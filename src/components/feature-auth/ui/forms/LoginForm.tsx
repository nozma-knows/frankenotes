import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import TextField from "@/components/ui/form-fields/TextField";
import Button from "@/components/ui/buttons/Button";
import { REGEX_EMAIL } from "@/components/utils/regex";

interface LoginFormProps {
  loading: boolean;
  onSubmit: SubmitHandler<FieldValues>;
}

export default function LoginForm({ loading, onSubmit }: LoginFormProps) {
  // React Hook Form variables
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ flexGrow: 1 }} className="w-full">
        <Grid container columnSpacing={3}>
          <Grid item xs={12}>
            <TextField
              control={control}
              name="email"
              type="text"
              placeholder="Email address"
              required="Email is required."
              pattern={{
                value: REGEX_EMAIL,
                message: "Please enter a valid email address",
              }}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              control={control}
              name="password"
              type="password"
              placeholder="Password"
              required="Password is required."
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} className="flex justify-center">
            <Button label="Let me in" loading={loading} />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}
