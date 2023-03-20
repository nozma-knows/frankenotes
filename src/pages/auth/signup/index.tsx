import React, { useState } from "react";
import Router from "next/router";
import { useMutation } from "@apollo/client";
import { FieldValues } from "react-hook-form";
import { Session } from "@/__generated__/graphql";
import { CreateLoginMutation } from "@/components/graph";
import AuthPage from "@/components/feature-auth";
import SignupForm from "@/components/feature-auth/ui/forms/SignupForm";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState<string>();

  const [createLogin, { loading, error }] = useMutation(CreateLoginMutation, {
    onCompleted: (data: { login: Session }) => {
      return Router.push("/auth/login");
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const onSubmit = async (data: FieldValues) => {
    createLogin({
      variables: {
        input: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
      },
    });
  };

  return (
    <AuthPage
      title="Sign up"
      loading={false}
      onSubmit={onSubmit}
      Form={SignupForm}
      error={undefined}
      errorMessage={errorMessage}
    />
  );
}
