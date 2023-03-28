import React from "react";
import Dialog from "@mui/material/Dialog";
import { BsXLg } from "react-icons/bs";

interface PopupProps {
  title?: string;
  style: any;
  onClose: any;
  children: JSX.Element;
}

export default function Popup({ title, style, onClose, children }: PopupProps) {
  return (
    <Dialog
      open
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style,
      }}
      fullWidth
      maxWidth="xl"
    >
      <div className="flex h-full w-full ">
        <BsXLg
          className="absolute top-6 right-6 text-main-dark font-bold text-2xl cursor-pointer"
          onClick={onClose}
        />
        {title && (
          <div className="text-2xl md:text-4xl font-bold pb-8">{title}</div>
        )}
        {children}
      </div>
    </Dialog>
  );
}
