import React, { useState } from "react";
import { Note } from "@/__generated__/graphql";
import OpenView from "./OpenView";
import ClosedView from "./ClosedView";
import { ApolloQueryResult } from "@apollo/client";

interface FileManagerProps {
  files: Note[];
  authorId: string;
  activeNote: Note | null;
  setActiveNote: (activeNote: Note | null) => void;
  refetch: (
    variables?: Partial<{ authorId: string | undefined }> | undefined
  ) => Promise<ApolloQueryResult<any>>;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}

export default function FileManager({
  files,
  authorId,
  activeNote,
  setActiveNote,
  refetch,
  setFileManagerOpen,
}: FileManagerProps) {
  const [open, setOpen] = useState(true);

  if (open) {
    return (
      <OpenView
        files={files}
        authorId={authorId}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        setOpen={setOpen}
        refetch={refetch}
        setFileManagerOpen={setFileManagerOpen}
      />
    );
  }
  return <ClosedView setOpen={setOpen} />;
}
