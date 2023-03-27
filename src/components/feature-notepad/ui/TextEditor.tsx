import { useContext } from "react";
import NoteContext from "../context/useNoteContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import SaveToDBPlugin from "../plugins/save-to-db";
import { EditorState } from "lexical";
import { Note } from "@/__generated__/graphql";
import DetailsPlugin from "../plugins/details";
import SpeechToTextPlugin from "../plugins/speech-to-text";
import { useEditorHistoryState } from "../context/EditorHistoryState";

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
  const { historyState } = useEditorHistoryState();

  return (
    <div className="flex flex-col w-full h-full rounded-lg p-2  bg-main-light">
      <DetailsPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="flex h-full p-4 max-h-min flex-col w-full outline-none overflow-y-auto text-main-light editor" />
        }
        placeholder={<div></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ClearEditorPlugin />
      <HistoryPlugin externalHistoryState={historyState} />
      <SpeechToTextPlugin />
      <TabIndentationPlugin />
      <OnChangePlugin
        onChange={(editorState: EditorState) =>
          onChange(editorState, activeNote, setActiveNote)
        }
      />
      <SaveToDBPlugin />
    </div>
  );
}
