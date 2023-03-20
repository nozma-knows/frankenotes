import React from "react";
import Dialog from "@mui/material/Dialog";

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
      {title && (
        <div className="text-2xl md:text-4xl font-bold pb-8">{title}</div>
      )}
      {children}
    </Dialog>
  );
}
