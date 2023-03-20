import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { UpdateNoteMutation } from "@/components/graph";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "../spech-to-text";
import { BsMic, BsChevronUp, BsPlus, BsChevronRight } from "react-icons/bs";
import { TbPrompt } from "react-icons/tb";
import { Note } from "@/__generated__/graphql";
import ToolbarButton from "../toolbar-plugin/ui/buttons/ToolbarButton";
import {
  FormatDateTimeLong,
  FormatDateShort,
} from "@/components/utils/conversion/FormatDate";
import useWindowSize, {
  smScreenMax,
} from "@/components/utils/hooks/useWindowSize";
// import theme from "@/components/ui/form-fields/ToolbarTheme";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import TextField from "@/components/ui/form-fields/TextField";

const FilesView = ({
  setFileManagerOpen,
}: {
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) => {
  const size = useWindowSize();
  return (
    <div className="flex flex-col gap-2">
      <ToolbarButton
        Icon={BsPlus}
        label="Create new file"
        disabled={false}
        onClick={() => console.log("Create file button clicked.")}
        className="flex items-center justify-center button bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]"
        iconSize="text-4xl"
      />
      <ToolbarButton
        Icon={size.width > smScreenMax ? BsChevronRight : BsChevronUp}
        label="Open file manager"
        disabled={false}
        onClick={() => setFileManagerOpen(true)}
        className="flex items-center justify-center button bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]"
        iconSize="text-2xl"
      />
    </div>
  );
};

const DetailsView = ({
  activeFile,
  setActiveFile,
  thin = false,
}: {
  activeFile: Note | null;
  setActiveFile: (activeFile: Note | null) => void;
  thin?: boolean;
}) => {
  const [title, setTitle] = useState(
    activeFile && activeFile.title ? activeFile.title : ""
  );

  useEffect(() => {
    setTitle(activeFile && activeFile.title ? activeFile.title : "");
  }, [activeFile]);

  // useMutaiton call for creating a note
  const [
    updateNote,
    { loading: loadingUpdateNote, error: errorUpdateingNote },
  ] = useMutation(UpdateNoteMutation, {
    onCompleted: ({ updateNote }) => {},
    onError: () => console.log("error!"),
  });

  const UpdateNote = useCallback(
    ({ updatedTitle }: { updatedTitle: string }) => {
      if (activeFile) {
        const { id, authorId, content } = activeFile;
        updateNote({
          variables: {
            id,
            input: {
              authorId,
              title: updatedTitle,
              content,
            },
          },
        });
      }
    },
    [activeFile, updateNote]
  );

  useEffect(() => {
    UpdateNote({
      updatedTitle: title,
    });
  }, [UpdateNote, title]);

  return (
    <div className="flex w-full flex-col gap-2 bg-tertiary-dark rounded-lg pt-1 pb-2 px-2">
      {activeFile && (
        <div className="flex flex-col h-full justify-between">
          <input
            className={`text-2xl w-full font-bold ${
              !activeFile.title && "opacity-60"
            } bg-transparent`}
            name="title"
            value={title}
            placeholder="Untitled"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2 text-xl text-main-dark">
            <div className="font-bold">
              <div>Created</div>
              <div>Updated</div>
            </div>
            <div>
              <div>
                {thin ? (
                  <>
                    {FormatDateShort({
                      date: new Date(Number(activeFile.createdAt)),
                    })}
                  </>
                ) : (
                  <>
                    {FormatDateTimeLong({
                      date: new Date(Number(activeFile.createdAt)),
                    })}
                  </>
                )}
              </div>
              <div>
                {thin ? (
                  <>
                    {FormatDateShort({
                      date: new Date(Number(activeFile.updatedAt)),
                    })}
                  </>
                ) : (
                  <>
                    {FormatDateTimeLong({
                      date: new Date(Number(activeFile.updatedAt)),
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryView = () => {
  return (
    <div className="flex w-full flex-col gap-2 bg-tertiary-dark text-main-dark rounded-lg pt-1 pb-2 px-2">
      <div>Summary View</div>
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
  return (
    <div className="flex flex-col gap-2">
      {SUPPORT_SPEECH_RECOGNITION && (
        <ToolbarButton
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

      <ToolbarButton
        Icon={TbPrompt}
        label="AI Prompt"
        disabled={false}
        onClick={() => console.log("Clicked AI propmt button")}
        className="flex items-center justify-center button bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]"
        iconSize="text-3xl"
      />
    </div>
  );
};

export default function DetailsPlugin({
  size,
  activeFile,
  setActiveFile,
  fileManagerOpen,
  setFileManagerOpen,
}: {
  size: string;
  activeFile: Note | null;
  setActiveFile: (activeFile: Note | null) => void;
  fileManagerOpen: boolean;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSpeechToText, setIsSpeechToText] = useState(false);

  return (
    <div className="flex w-full h-32 gap-2 px-2">
      {!fileManagerOpen && (
        <FilesView setFileManagerOpen={setFileManagerOpen} />
      )}
      <DetailsView
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        thin={size === "sm"}
      />
      {size === "lg" && <SummaryView />}
      <ControlsView
        editor={editor}
        isSpeechToText={isSpeechToText}
        setIsSpeechToText={setIsSpeechToText}
      />
    </div>
  );
}
