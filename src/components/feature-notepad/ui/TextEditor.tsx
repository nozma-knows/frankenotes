import { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import { CreateNoteMutation } from "@/components/graph";
import NoteContext from "../context/useNoteContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import SaveToDBPlugin from "../plugins/save-to-db";
import SaveToVectorStorePlugin from "../plugins/save-to-vector-store";
import { EditorState, $getRoot } from "lexical";
import DetailsPlugin from "../plugins/details";
import ToolbarPlugin from "../plugins/toolbar";
import SpeechToTextPlugin from "../plugins/speech-to-text";
import { useEditorHistoryState } from "../context/EditorHistoryState";
import LinkPlugin from "../plugins/link";
import PlaygroundAutoLinkPlugin from "../plugins/auto-link";
import FeedbackButton from "./buttons/FeedbackButton";
// import OnChange from "../utils/onChange";
import { Note } from "@/__generated__/graphql";

interface OnChangeProps {
  editorState: EditorState;
  activeNote: Note | null;
  setActiveNote: (activeNote: Note | null) => void;
}

const onChange = ({
  editorState,
  activeNote,
  setActiveNote,
}: OnChangeProps) => {
  if (editorState) {
    editorState.read(() => {
      const root = $getRoot();

      // const isEmpty =
      //   !root.getFirstChild() ||
      //   (root.getFirstChild()?.isEmpty() && root.getChildrenSize() === 1);

      if (activeNote) {
        setActiveNote({
          ...activeNote,
          editorState: JSON.stringify(editorState),
        });
      }
    });
  }
};

export default function TextEditor() {
  // Grab vars from context
  const {
    authorId,
    activeNote,
    setActiveNote,
    refetchNotes,
    setShowFeedbackPopup,
  } = useContext(NoteContext);

  const { historyState } = useEditorHistoryState();

  // Create note mutation
  const [createNote] = useMutation(CreateNoteMutation, {
    onCompleted: (data: { createNote: Note }) => {
      refetchNotes();
      setActiveNote(data.createNote);
    },
    onError: () => console.log("error!"),
  });
  // Function for calling create note mutation
  const CreateNote = (editorState: EditorState) => {
    const input = {
      authorId,
      editorState: JSON.stringify(editorState),
    };
    createNote({
      variables: {
        input,
      },
    });
  };

  return (
    <div className="flex flex-col w-full h-full rounded-lg px-2 bg-main-light overflow-hidden relative">
      <FeedbackButton
        disabled={false}
        setShowFeedbackPopup={setShowFeedbackPopup}
      />
      <ToolbarPlugin />
      <DetailsPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="flex h-full py-4 px-2 max-h-min flex-col w-full outline-none overflow-y-auto text-main-light editor" />
        }
        placeholder={<div></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ClearEditorPlugin />
      <HistoryPlugin externalHistoryState={historyState} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <SpeechToTextPlugin />
      <TabIndentationPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <AutoFocusPlugin />
      <LinkPlugin />
      <PlaygroundAutoLinkPlugin />
      <OnChangePlugin
        onChange={(editorState: EditorState) => {
          console.log("activeNote in onChange call: ", activeNote);
          onChange({
            editorState,
            activeNote,
            setActiveNote,
          });
        }}
      />
      <SaveToDBPlugin />
      <SaveToVectorStorePlugin />
    </div>
  );
}
