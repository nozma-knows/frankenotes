// import { useState, useEffect } from "react";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import dynamic from "next/dynamic";
const Topbar = dynamic(() => import("@/components/feature-navigation/topbar"), {
  ssr: false,
});

interface PageProps {
  hideTopbar?: boolean;
  children: JSX.Element;
}
export default function Page({ hideTopbar = false, children }: PageProps) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();

  return (
    <div
      className="flex flex-col"
      style={{ width: screenWidth, height: screenHeight }}
    >
      {!hideTopbar && <Topbar />}
      <div className="flex w-full h-full bg-green-900">{children}</div>
    </div>
  );
}
