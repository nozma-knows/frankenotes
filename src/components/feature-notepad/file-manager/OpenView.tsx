import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm, FieldValues } from "react-hook-form";
import { CreateNoteMutation, DeleteNoteMutation } from "@/components/graph";
import { Note } from "@/__generated__/graphql";
// import { FaTrash } from "react-icons/fa";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import {
  BsQuestionLg,
  BsSearch,
  BsPlusLg,
  BsChevronLeft,
  BsChevronDown,
  BsXLg,
  BsCheck,
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
  // const [namingFile, setNamingFile] = useState(false);
  const [showQueryNotesPopup, setShowQueryNotesPopup] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FieldValues>();

  const createNewNote = () => {
    CreateNote();

    // setNamingFile(false);
    // setValue("title", "");
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
            <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <BsSearch
                className="text-lg"
                onClick={() => console.log("search pressed.")}
              />
            </div>
            <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <BsQuestionLg
                className="cursor-pointer"
                onClick={() => setShowQueryNotesPopup(true)}
              />
            </div>
          </div>
          <div className="flex gap-1 sm:gap-4">
            <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <BsPlusLg
                className="cursor-pointer"
                // onClick={() => setNamingFile(true)}
                onClick={() => createNewNote()}
              />
            </div>
            <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              {size.width >= smScreenMax ? (
                <BsChevronLeft
                  className="cursor-pointer"
                  onClick={() => setFileManagerOpen(false)}
                />
              ) : (
                <BsChevronDown
                  className="cursor-pointer"
                  onClick={() => setFileManagerOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
        {/* {namingFile ? (
          <div className="flex items-center w-full">
            <form
              className="flex items-center gap-4 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                {...register("title")}
                className="bg-transparent border-b-2 border-[#1e2626] outline-none w-full"
              />
              <div className="flex gap-1 sm:gap-4">
                <button className="flex items-center justify-center w-9 h-9 bg-tertiary-dark rounded-md">
                  <BsCheck type="submit" className="cursor-pointer text-2xl" />
                </button>

                <div className="flex items-center justify-center w-9 h-9 bg-tertiary-dark rounded-md">
                  <BsXLg
                    className="cursor-pointer text-lg"
                    onClick={() => setNamingFile(false)}
                  />
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex w-full gap-1 justify-between items-center">
            <div className="flex gap-1 sm:gap-4">
              <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
                <BsSearch
                  className="text-lg"
                  onClick={() => console.log("search pressed.")}
                />
              </div>
              <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
                <BsQuestionLg
                  className="cursor-pointer"
                  onClick={() => setShowQueryNotesPopup(true)}
                />
              </div>
            </div>
            <div className="flex gap-1 sm:gap-4">
              <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
                <BsPlusLg
                  className="cursor-pointer"
                  onClick={() => setNamingFile(true)}
                />
              </div>
              <div className="button flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
                <BsChevronLeft
                  className="cursor-pointer"
                  onClick={() => setFileManagerOpen(false)}
                />
              </div>
            </div>
          </div>
        )} */}
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
