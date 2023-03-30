import { createContext } from "react";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { EditorState } from "lexical";
import { Note, NotesQuery } from "@/__generated__/graphql";

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
  notesQueries: NotesQuery[];
  refetchNotesQueries: (
    variables?:
      | Partial<{
          authorId: string | undefined;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
  fileManagerOpen: boolean;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
  showFeedbackPopup: boolean;
  setShowFeedbackPopup: (showFeedbackPopup: boolean) => void;
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
  notesQueries: [],
  refetchNotesQueries: () => Promise.resolve({} as ApolloQueryResult<any>),
  fileManagerOpen: true,
  setFileManagerOpen: () => {},
  showFeedbackPopup: false,
  setShowFeedbackPopup: () => {},
});

export default NoteContext;
