import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { UpdateNoteMutation } from "@/components/graph";
import { LexicalEditor } from "lexical";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "../spech-to-text";
import { BsMic, BsChevronUp, BsPlus, BsChevronRight } from "react-icons/bs";
import { TbPrompt } from "react-icons/tb";
import { PulseLoader } from "react-spinners";
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
  }, [UpdateNote, activeFile, setActiveFile, title]);

  return (
    <div className="flex flex-1 w-full flex-col gap-2 bg-tertiary-dark rounded-lg p-3">
      {activeFile && (
        <div className="flex flex-col h-full justify-between">
          <input
            className={`text-2xl w-full font-bold ${
              !activeFile.title && "opacity-60"
            } bg-transparent outline-none`}
            name="title"
            value={title}
            placeholder="Untitled"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() =>
              activeFile?.title !== title &&
              setActiveFile({ ...activeFile, title: title })
            }
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

const SummaryView = ({
  summary,
  loading,
}: {
  summary: string;
  loading: boolean;
}) => {
  return (
    <div className="flex flex-1 w-full bg-tertiary-dark rounded-lg">
      {loading ? (
        <PulseLoader color="#e3d1e6" size={8} className="py-7 px-4" />
      ) : (
        <div className="p-3 overflow-auto">{summary}</div>
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

const handleSummarizeNote = async ({
  note,
  setSummary,
  setSummaryLoading,
}: {
  note: Note | undefined;
  setSummary: (summary: string) => void;
  setSummaryLoading: (summaryLoading: boolean) => void;
}) => {
  try {
    if (note) {
      if (note.content) {
        setSummaryLoading(true);
        const response = await fetch(`../api/summarize-note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: note.content,
          }),
        });
        const data = await response.json();
        setSummary(data.message);
        setSummaryLoading(false);
      } else {
        setSummary(
          `Whenever you open a document that's not empty, this section will summarize your note!`
        );
        setSummaryLoading(false);
      }
    }
  } catch (error) {
    console.error("Error submitting prompt: ", error);
  }
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
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!activeFile) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      setSummary("");
    }
    if (activeFile && noteId !== activeFile.id) {
      setNoteId(activeFile.id);
    } else {
    }
  }, [activeFile, noteId, summary, editor]);

  // useEffect(() => {
  //   if (noteId) {
  //     handleSummarizeNote({
  //       note: activeFile!,
  //       setSummary,
  //       setSummaryLoading,
  //     });
  //   }
  // }, [activeFile, noteId]);

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
      {size === "lg" && (
        <SummaryView summary={summary} loading={summaryLoading} />
      )}
      <ControlsView
        editor={editor}
        isSpeechToText={isSpeechToText}
        setIsSpeechToText={setIsSpeechToText}
      />
    </div>
  );
}
