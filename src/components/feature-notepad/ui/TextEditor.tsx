import { useEffect, useContext } from "react";
import NoteContext from "../context/useNoteContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import { Note } from "@/__generated__/graphql";

function onChange(
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

export default function TextEditor() {
  const { activeNote, setActiveNote } = useContext(NoteContext);

  return (
    <div className="flex w-full h-full bg-blue-400">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="flex h-full p-4 max-h-min flex-col w-full outline-none overflow-y-auto text-main-light editor" />
        }
        placeholder={<div></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(editorState: EditorState) =>
          onChange(editorState, activeNote, setActiveNote)
        }
      />
    </div>
  );
}
