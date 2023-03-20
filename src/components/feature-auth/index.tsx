import React, { useState, useEffect } from "react";
import { ApolloError } from "@apollo/client";
import { FieldValues } from "react-hook-form";
import { FormProps } from "./ui/forms/FormProps";
import Topbar from "./ui/Topbar";
import useWindowSize from "@/components/utils/hooks/useWindowSize";

interface AuthPageProps {
  title: string;
  loading: boolean;
  onSubmit: (data: FieldValues) => void;
  Form: ({ loading, onSubmit }: FormProps) => JSX.Element;
  error: ApolloError | undefined;
  errorMessage: string | undefined;
}

export default function AuthPage({
  title,
  loading,
  onSubmit,
  Form,
  error,
  errorMessage,
}: AuthPageProps) {
  const size = useWindowSize();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(size.height);
  }, [size]);

  return (
    <div
      className="relative flex flex-col w-screen items-center justify-center gap-8 bg-main-dark text-main-dark"
      style={{
        height,
      }}
    >
      <div className="absolute top-0 flex w-full">
        <Topbar />
      </div>

      <h1 className="text-main-dark">{title}</h1>
      <div className="w-full px-2 sm:w-4/5 md:w-2/3 max-w-[720px]">
        <Form loading={loading} onSubmit={onSubmit} />
      </div>
      {error && <div>{`${errorMessage}`}</div>}
    </div>
  );
}
