import { useContext } from "react";
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
import { EditorState } from "lexical";
import { Note } from "@/__generated__/graphql";
import DetailsPlugin from "../plugins/details";
import ToolbarPlugin from "../plugins/toolbar";
import SpeechToTextPlugin from "../plugins/speech-to-text";
import { useEditorHistoryState } from "../context/EditorHistoryState";
import LinkPlugin from "../plugins/link";
import PlaygroundAutoLinkPlugin from "../plugins/auto-link";
import { Tooltip } from "@mui/material";
import { BsFillChatRightFill } from "react-icons/bs";

const FeedbackButton = ({
  disabled,
  setShowFeedbackPopup,
}: {
  disabled: boolean;
  setShowFeedbackPopup: (showFeedbackPopup: boolean) => void;
}) => {
  return (
    <div className="absolute bottom-4 right-4">
      <Tooltip title="Share feedback!" arrow>
        <button
          disabled={disabled}
          onClick={() => setShowFeedbackPopup(true)}
          type="button"
          aria-label="Share feedback!"
          className={`${!disabled && "button"} bg-tertiary-dark p-2 rounded-lg`}
        >
          <BsFillChatRightFill className="p-2 w-12 h-12" />
        </button>
      </Tooltip>
    </div>
  );
};

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
  const { activeNote, setActiveNote, setShowFeedbackPopup } =
    useContext(NoteContext);
  const { historyState } = useEditorHistoryState();

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
        onChange={(editorState: EditorState) =>
          onChange(editorState, activeNote, setActiveNote)
        }
      />
      <SaveToDBPlugin />
      <SaveToVectorStorePlugin />
    </div>
  );
}
