import { useState, useEffect, useContext, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import NoteContext from "../../context/useNoteContext";
import { Note } from "@/__generated__/graphql";
import EditorButton from "../../ui/buttons/EditorButton";
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "../speech-to-text";
import { BsMic } from "react-icons/bs";
import { TbPrompt } from "react-icons/tb";
import { LexicalEditor } from "lexical";

const DetailsView = ({
  activeNote,
  setActiveNote,
}: {
  activeNote: Note | null;
  setActiveNote: (activeNote: Note | null) => void;
}) => {
  const [title, setTitle] = useState(
    activeNote && activeNote.title ? activeNote.title : ""
  );

  useEffect(() => {
    setTitle(activeNote && activeNote.title ? activeNote.title : "");
  }, [activeNote]);

  return (
    <div className="flex flex-1 w-full flex-col gap-2 bg-tertiary-dark rounded-lg p-3">
      {activeNote && (
        <div className="flex flex-col h-full justify-between">
          <input
            className={`text-2xl w-full font-bold ${
              (!activeNote.title || title !== activeNote.title) && "opacity-60"
            } bg-transparent outline-none`}
            name="title"
            value={title}
            placeholder="Untitled"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() =>
              activeNote.title !== title &&
              setActiveNote({ ...activeNote, title: title })
            }
          />
        </div>
      )}
    </div>
  );
};

const ControlsView = ({
  editor,
  isSpeechToText,
  setIsSpeechToText,
}: {
  editor: LexicalEditor;
  isSpeechToText: boolean;
  setIsSpeechToText: (isSpeechToText: boolean) => void;
}) => {
  const aiPromptButtonDisabled = true;
  return (
    <div className="flex flex-col gap-2">
      {SUPPORT_SPEECH_RECOGNITION && (
        <EditorButton
          Icon={BsMic}
          label="Speech-to-text"
          disabled={false}
          active={isSpeechToText}
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
          }}
          className="flex items-center justify-center button bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]"
          iconSize="text-3xl"
        />
      )}

      <EditorButton
        Icon={TbPrompt}
        label="AI Prompt - Feature coming soon!"
        disabled={aiPromptButtonDisabled}
        onClick={() => console.log("Clicked AI propmt button")}
        className={`${
          aiPromptButtonDisabled ? "opacity-50 cursor-not-allowed" : "button"
        } flex items-center justify-center bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]`}
        iconSize="text-3xl"
      />
    </div>
  );
};

export default function DetailsPlugin() {
  const { activeNote, setActiveNote } = useContext(NoteContext);
  const [editor] = useLexicalComposerContext();

  const [isSpeechToText, setIsSpeechToText] = useState(false);

  return (
    <div className="flex w-full h-32 gap-2">
      <DetailsView activeNote={activeNote} setActiveNote={setActiveNote} />
      <ControlsView
        editor={editor}
        isSpeechToText={isSpeechToText}
        setIsSpeechToText={setIsSpeechToText}
      />
    </div>
  );
}
