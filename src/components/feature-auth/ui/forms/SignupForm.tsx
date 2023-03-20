import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { TextField } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/buttons";
import { REGEX_EMAIL } from "@/components/utils/regex";

interface SignupFormProps {
  loading: boolean;
  onSubmit: SubmitHandler<FieldValues>;
}

export default function SignupForm({ loading, onSubmit }: SignupFormProps) {
  // React Hook Form variables
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FieldValues>();

  const watchPassword = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ flexGrow: 1 }} className="w-full">
        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              name="firstName"
              type="text"
              placeholder="First name"
              required="First name is required."
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              name="lastName"
              type="text"
              placeholder="Last name"
              required="Last name is required."
              errors={errors}
            />
          </Grid>
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
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              name="password"
              type="password"
              placeholder="Password"
              required="Password is required."
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              control={control}
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm Password"
              required="Must confirm password."
              validate={(value: any) =>
                value === watchPassword || "Passwords must match"
              }
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
