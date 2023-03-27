import { createContext } from "react";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { EditorState } from "lexical";
import { Note } from "@/__generated__/graphql";

type NoteContextType = {
  authorId: string;
  size: string;
  activeNote: Note | null;
  setActiveNote: (activeFile: Note | null) => void;
  notes: Note[];
  loadingNotes: boolean;
  errorGrabbingNotes: ApolloError | undefined;
  refetchNotes: (
    variables?:
      | Partial<{
          authorId: string | undefined;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
  fileManagerOpen: boolean;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
};

const NoteContext = createContext<NoteContextType>({
  authorId: "",
  size: "lg",
  activeNote: null,
  setActiveNote: () => {},
  notes: [],
  loadingNotes: false,
  errorGrabbingNotes: undefined,
  refetchNotes: () => Promise.resolve({} as ApolloQueryResult<any>),
  fileManagerOpen: true,
  setFileManagerOpen: () => {},
});

export default NoteContext;
