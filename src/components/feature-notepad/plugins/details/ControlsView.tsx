import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BsMic } from "react-icons/bs";
import { TbPrompt } from "react-icons/tb";

import {
  SUPPORT_SPEECH_RECOGNITION,
  SPEECH_TO_TEXT_COMMAND,
} from "../speech-to-text";
import EditorButton from "../../ui/buttons/EditorButton";

export default function ControlsView() {
  const [editor] = useLexicalComposerContext();
  const [isSpeechToText, setIsSpeechToText] = useState(false);

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
}
