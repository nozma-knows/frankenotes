import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useMutation } from "@apollo/client";
import { FieldValues } from "react-hook-form";
import { CreateSessionMutation } from "@/components/graph";
import { Session } from "@/__generated__/graphql";
import LoginForm from "@/components/feature-auth/ui/forms/LoginForm";
import AuthPage from "@/components/feature-auth";

export function getServerSideProps(context: any) {
  return { props: {} };
}

export default function Login() {
  const router = useRouter();
  const [cookie, setCookie] = useCookies(["token"]);

  const [errorMessage, setErrorMessage] = useState<string>();

  const [createSession, { loading, error }] = useMutation(
    CreateSessionMutation,
    {
      onCompleted: (data: { login: Session }) => onCompleted(data),
      onError: (error) => setErrorMessage(error.message),
    }
  );

  const onCompleted = (data: { login: Session }) => {
    setCookie("token", JSON.stringify(data.login.token), {
      path: "/",
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    });
    localStorage.setItem("token", data.login.token);
    router.push("/app/notepad");
  };

  const onSubmit = async (data: FieldValues) => {
    createSession({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    });
  };

  return (
    <AuthPage
      title="Log in"
      loading={loading}
      onSubmit={onSubmit}
      Form={LoginForm}
      error={error}
      errorMessage={errorMessage}
    />
  );
}
