import { EditorState } from "lexical";
import { Note } from "@/__generated__/graphql";

export default function onChange(
  editorState: EditorState,
  activeNote: Note | null,
  setActiveNote: (activeNote: Note | null) => void
) {
  if (activeNote) {
    setActiveNote({
      ...activeNote,
      editorState: JSON.stringify(editorState),
    });
  }
}
