import React, { MouseEventHandler } from "react";
import { IconType } from "react-icons";

interface IconButtonProps {
  Icon: IconType;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function IconButton({ Icon, onClick }: IconButtonProps) {
  return (
    <button onClick={onClick}>
      <Icon className="text-3xl button" />
    </button>
  );
}
