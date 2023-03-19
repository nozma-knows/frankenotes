// import { useState, useEffect } from "react";
import useWindowSize from "@/components/utils/hooks/useWindowSize";

interface PageProps {
  hideTopbar?: boolean;
  children: JSX.Element;
}
export default function Page({ hideTopbar = false, children }: PageProps) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();

  return (
    <div
      className="flex flex-col justify-center items-center bg-red-900"
      style={{ width: screenWidth, height: screenHeight }}
    >
      {!hideTopbar && (
        <div className="flex h-28">
          <div>Topbar</div>
        </div>
      )}
      <div className="flex w-full h-full bg-green-900">{children}</div>
    </div>
  );
}
