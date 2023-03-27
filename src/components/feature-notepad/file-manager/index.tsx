import React, { useContext, MouseEventHandler } from "react";
import { useMutation } from "@apollo/client";
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
import { CreateNoteMutation, DeleteNoteMutation } from "@/components/graph";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";
import { Note } from "@/__generated__/graphql";
import NoteContext from "../context/useNoteContext";
import { smScreenMax } from "@/components/utils/hooks/useWindowSize";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import { EditorState } from "lexical";

const emptyEditorState =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
interface FileManagerProps {
  files: Note[];
  authorId: string;
}

// File Manager - Topbar Button Component
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

// File Manager - Topbar Component
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
  const createNewNote = () => {
    CreateNote();
  };

  return (
    <div className="flex w-full p-2 rounded-t-xl">
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

// Props passed into FilePreview
interface FilePreviewProps {
  file: Note;
  isActive: boolean;
  setActiveFile: (activeNote: Note | null) => void;
  DeleteNote: ({ note }: { note: Note }) => void;
  // editorState: EditorState;
  // setEditorState: (editorState: EditorState) => void;
}

const handleUpdateActiveFile = ({
  file,
  setActiveFile,
}: // editorState,
// setEditorState,
{
  file: Note;
  setActiveFile: (file: Note) => void;
  // editorState: EditorState;
  // setEditorState: (editorState: EditorState) => void;
}) => {
  setActiveFile(file);
};

//
const FilePreview = ({
  file,
  isActive,
  setActiveFile,
  DeleteNote,
}: // editorState,
// setEditorState,
FilePreviewProps) => {
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
          onClick={() =>
            handleUpdateActiveFile({
              file,
              setActiveFile,
              // editorState,
              // setEditorState,
            })
          }
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

export default function FileManager({ files, authorId }: FileManagerProps) {
  const size = useWindowSize();
  const {
    activeNote,
    setActiveNote,
    refetchNotes,
    setFileManagerOpen,
    // editorState,
    // setEditorState,
  } = useContext(NoteContext);

  // Create note mutation
  const [createNote] = useMutation(CreateNoteMutation, {
    onCompleted: (data: { createNote: Note }) => {
      refetchNotes();
      setActiveNote(data.createNote);
    },
    onError: () => console.log("error!"),
  });

  // Function for calling create note mutation
  const CreateNote = () => {
    const input = {
      authorId,
      editorState: emptyEditorState,
    };
    createNote({
      variables: {
        input,
      },
    });
  };

  // Delete note mutation
  const [deleteNote, { loading: deletingNote, error: errorDeletingNote }] =
    useMutation(DeleteNoteMutation, {
      onCompleted: (data: { deleteNote: Note }) => {
        refetchNotes();
        if (data.deleteNote.id === activeNote?.id) {
          setActiveNote(null);
        }
      },
      onError: () => console.log("error!"),
    });

  // Function for calling delete note mutation
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
              // editorState={editorState}
              // setEditorState={setEditorState}
            />
          );
        })}
      </div>
    </div>
  );
}
