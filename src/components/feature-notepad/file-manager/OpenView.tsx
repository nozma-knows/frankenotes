import React, {
  MouseEventHandler,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useMutation } from "@apollo/client";
import { useForm, FieldValues } from "react-hook-form";
import { CreateNoteMutation, DeleteNoteMutation } from "@/components/graph";
import { Note } from "@/__generated__/graphql";
import { Tooltip } from "@mui/material";
import { IconType } from "react-icons";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import {
  BsQuestionLg,
  BsSearch,
  BsPlusLg,
  BsChevronLeft,
  BsChevronDown,
} from "react-icons/bs";
import { ApolloQueryResult } from "@apollo/client";
import QueryNotesPopup from "@/components/feature-ai/ui/popups/QueryNotesPopup";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";
import useWindowSize, {
  smScreenMax,
} from "@/components/utils/hooks/useWindowSize";

interface OpenViewProps {
  files: Note[];
  authorId: string;
  activeNote: Note | null;
  setActiveNote: (activeNote: Note | null) => void;
  setOpen: (open: boolean) => void;
  refetch: (
    variables?: Partial<{ authorId: string | undefined }> | undefined
  ) => Promise<ApolloQueryResult<any>>;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}

const TopbarButton = ({
  Icon,
  onClick,
  label,
  disabled = false,
  disabledMessage,
}: {
  Icon: IconType;
  onClick: MouseEventHandler<SVGElement>;
  label: string;
  disabled?: boolean;
  disabledMessage?: string;
}) => {
  return (
    <div
      className={
        disabled ? `cursor-not-allowed	opacity-50 text-lg` : `button text-lg`
      }
    >
      <Tooltip title={disabled ? `${label} - ${disabledMessage}` : label} arrow>
        <div>
          <Icon className="text-lg" onClick={!disabled ? onClick : undefined} />
        </div>
      </Tooltip>
    </div>
  );
};

const Topbar = ({
  size,
  authorId,
  notes,
  CreateNote,
  setFileManagerOpen,
}: {
  size: { width: number; height: number };
  authorId: string;
  notes: Note[];
  CreateNote: any;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) => {
  const [showQueryNotesPopup, setShowQueryNotesPopup] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FieldValues>();

  const createNewNote = () => {
    CreateNote();
  };

  return (
    <div className="flex w-full p-2 rounded-t-xl">
      {showQueryNotesPopup && (
        <QueryNotesPopup
          notes={notes}
          authorId={authorId}
          onClose={() => setShowQueryNotesPopup(false)}
        />
      )}
      <div className="flex gap-1 sm:gap-4 items-center justify-end w-full">
        <div className="flex w-full gap-1 justify-between items-center text-main-dark">
          <div className="flex gap-1 sm:gap-4">
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <TopbarButton
                Icon={BsSearch}
                onClick={() => console.log("search pressed.")}
                label="Search notes"
                disabled={true}
                disabledMessage="Feature coming soon!"
              />
            </div>
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <TopbarButton
                Icon={BsQuestionLg}
                onClick={() => setShowQueryNotesPopup(true)}
                label="Ask your notes a question"
                // disabled={true}
                // disabledMessage="Feature coming soon!"
              />
            </div>
          </div>
          <div className="flex gap-1 sm:gap-4">
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <TopbarButton
                Icon={BsPlusLg}
                onClick={() => createNewNote()}
                label="Create a new note"
              />
            </div>
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              {size.width >= smScreenMax ? (
                <TopbarButton
                  Icon={BsChevronLeft}
                  onClick={() => setFileManagerOpen(false)}
                  label="Close file manager"
                />
              ) : (
                <TopbarButton
                  Icon={BsChevronDown}
                  onClick={() => setFileManagerOpen(false)}
                  label="Close file manager"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilePreviewProps {
  file: Note;
  isActive: boolean;
  setActiveFile: (activeNote: Note | null) => void;
  DeleteNote: ({ note }: { note: Note }) => void;
}

const FilePreview = ({
  file,
  isActive,
  setActiveFile,
  DeleteNote,
}: FilePreviewProps) => {
  const { title, updatedAt } = file;
  return (
    <div className="flex items-center justify-between px-2 my-0.5">
      <div
        className={`flex w-full items-center justify-between p-2 gap-2 rounded-lg cursor-pointer hover:bg-[#1e2626] hover:text-[#e3d1e6] ${
          isActive ? "bg-tertiary-dark text-main-dark" : "text-main-light"
        }`}
      >
        <div
          className="truncate pr-4 w-full"
          onClick={() => setActiveFile(file)}
        >
          {title || "Untitled"}
        </div>
        <DropDown
          className="flex text-3xl button"
          disabled={false}
          buttonClassName="toolbar-item block-controls"
          Icon={BsThreeDots}
          buttonLabel="Profile"
          buttonAriaLabel="Profile button"
          noArrow
          round
        >
          <DropDownItem
            onClick={() => DeleteNote({ note: file })}
            Icon={BsTrash}
            label="Delete Note"
          />
        </DropDown>
      </div>
    </div>
  );
};

export default function OpenView({
  files,
  authorId,
  activeNote,
  setActiveNote,
  setOpen,
  refetch,
  setFileManagerOpen,
}: OpenViewProps) {
  const size = useWindowSize();

  const handleDeleteFromVectorStore = useCallback(
    async ({ docId, doc }: { docId: string; doc: string }) => {
      try {
        const response = await fetch(`../api/delete-from-vectore-store`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            docId,
            doc,
            authorId,
          }),
        });
      } catch (error) {
        console.error("Error submitting prompt: ", error);
      }
    },
    [authorId]
  );

  // useMutaiton call for creating a note
  const [createNote, { loading: loadingNote, error: errorGrabbingNote }] =
    useMutation(CreateNoteMutation, {
      onCompleted: (data: { createNote: Note }) => {
        refetch();
        setActiveNote(data.createNote);
      },
      onError: () => console.log("error!"),
    });

  const CreateNote = () => {
    const input = {
      authorId,
      title: "",
      content: "",
    };
    createNote({
      variables: {
        input,
      },
    });
  };

  // useMutaiton call for deleting a note
  const [deleteNote, { loading: deletingNote, error: errorDeletingNote }] =
    useMutation(DeleteNoteMutation, {
      onCompleted: (data: { deleteNote: Note }) => {
        handleDeleteFromVectorStore({
          docId: data.deleteNote.id as string,
          doc: data.deleteNote.content as string,
        });

        refetch();
        if (data.deleteNote.id === activeNote?.id) {
          setActiveNote(null);
        }
      },
      onError: () => console.log("error!"),
    });

  const DeleteNote = ({ note }: { note: Note }) => {
    deleteNote({
      variables: {
        id: note.id,
      },
    });
  };

  return (
    <div className="flex flex-col w-full h-full bg-main-light rounded-xl overflow-hidden">
      <Topbar
        size={size}
        authorId={authorId}
        notes={files}
        CreateNote={CreateNote}
        setFileManagerOpen={setFileManagerOpen}
      />
      <div className="flex flex-col overflow-auto">
        {files.map((file: Note, index: number) => {
          return (
            <FilePreview
              key={index}
              file={file}
              isActive={activeNote ? activeNote.id === file.id : false}
              setActiveFile={setActiveNote}
              DeleteNote={DeleteNote}
            />
          );
        })}
      </div>
    </div>
  );
}
