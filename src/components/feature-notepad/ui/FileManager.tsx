/* eslint-disable react-hooks/exhaustive-deps */
import {
  MouseEventHandler,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useMutation } from "@apollo/client";
import { CreateNoteMutation, DeleteNoteMutation } from "@/components/graph";
import { Tooltip } from "@mui/material";
import { IconType } from "react-icons";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import {
  BsPlusLg,
  BsChevronLeft,
  BsChevronDown,
  BsQuestionLg,
} from "react-icons/bs";
import { smScreenMax } from "@/components/utils/hooks/useWindowSize";
import { Note } from "@/__generated__/graphql";
import NoteContext from "../context/useNoteContext";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, LexicalEditor, CLEAR_EDITOR_COMMAND } from "lexical";
import Logo from "@/components/ui/icons/Logo";
import FrankenotesLogo from "@/icons/logo.svg";
import QueryNotesPopup from "@/components/feature-ai/ui/popups/QueryNotesPopup";

const title = `Frankenotes`;

const emptyEditorState =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const FileManagerTopbarButton = ({
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

const FileManagerTopbar = ({
  editor,
  size,
  authorId,
  notes,
  CreateNote,
  setFileManagerOpen,
}: {
  editor: LexicalEditor;
  size: string;
  authorId: string;
  notes: Note[];
  CreateNote: any;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) => {
  const createNewNote = () => {
    editor.update(() => {
      $getRoot().clear();
    });
    CreateNote();
  };

  const [showQueryNotesPopup, setShowQueryNotesPopup] = useState(false);

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
          <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
            <div className="flex gap-1 sm:gap-4">
              <FileManagerTopbarButton
                Icon={BsQuestionLg}
                onClick={() => setShowQueryNotesPopup(true)}
                label="Ask your notes a question"
              />
            </div>
          </div>
          <div className="flex gap-1 sm:gap-4">
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <FileManagerTopbarButton
                Icon={BsPlusLg}
                onClick={() => createNewNote()}
                label="Create a new note"
              />
            </div>
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              {size != "sm" ? (
                <FileManagerTopbarButton
                  Icon={BsChevronLeft}
                  onClick={() => setFileManagerOpen(false)}
                  label="Close file manager"
                />
              ) : (
                <FileManagerTopbarButton
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

const handleUpdateActiveNote = (
  note: Note,
  setActiveNote: (activeNote: Note | null) => void,
  editor: LexicalEditor
) => {
  setActiveNote(note);
};

interface FilePreviewProps {
  note: Note;
  isActive: boolean;
  setActiveNote: (activeNote: Note | null) => void;
  DeleteNote: ({ note }: { note: Note }) => void;
}

const FilePreview = ({
  note,
  isActive,
  setActiveNote,
  DeleteNote,
}: FilePreviewProps) => {
  const { title, updatedAt } = note;
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex items-center justify-between px-2 my-0.5">
      <div
        className={`flex w-full items-center justify-between p-2 gap-2 rounded-lg cursor-pointer hover:bg-[#1e2626] hover:text-[#e3d1e6] ${
          isActive ? "bg-tertiary-dark text-main-dark" : "text-main-light"
        }`}
      >
        <div
          className="truncate pr-4 w-full"
          onClick={() => handleUpdateActiveNote(note, setActiveNote, editor)}
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
            onClick={() => DeleteNote({ note })}
            Icon={BsTrash}
            label="Delete Note"
          />
        </DropDown>
      </div>
    </div>
  );
};

export default function FileManager() {
  // Grab values from note context
  const {
    authorId,
    size,
    notes,
    refetchNotes,
    activeNote,
    setActiveNote,
    setFileManagerOpen,
  } = useContext(NoteContext);

  const [editor] = useLexicalComposerContext();

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

  const handleDeleteFromVectorStore = useCallback(
    async ({ docId, doc }: { docId: string; doc: string }) => {
      try {
        if (doc) {
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
        }
      } catch (error) {
        console.error("Error submitting prompt: ", error);
      }
    },
    [authorId]
  );

  useEffect(() => {
    if (activeNote?.id) {
      editor.setEditorState(editor.parseEditorState(activeNote.editorState));
    }
  }, [activeNote?.id, editor]);

  // Delete note mutation
  const [deleteNote] = useMutation(DeleteNoteMutation, {
    onCompleted: (data: { deleteNote: Note }) => {
      const editorState = editor.getEditorState();
      editorState.read(() => {
        const root = $getRoot();
        const content = root.getTextContent();
        handleDeleteFromVectorStore({
          docId: data.deleteNote.id as string,
          doc: content as string,
        });
      });
      refetchNotes();
      if (data.deleteNote.id === activeNote?.id) {
        setActiveNote(null);
      }
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
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
    <div className="flex flex-col w-full h-full sm:max-w-[16rem] md:max-w-[21rem] max-h-72 sm:max-h-none">
      <div className="hidden sm:flex justify-center p-2 pb-4">
        <Logo Icon={FrankenotesLogo} text={title} />
      </div>
      <div className="flex flex-col w-full h-full bg-main-light rounded-lg overflow-hidden">
        <FileManagerTopbar
          editor={editor}
          size={size}
          authorId={authorId}
          notes={notes}
          CreateNote={CreateNote}
          setFileManagerOpen={setFileManagerOpen}
        />
        <div className="flex flex-col overflow-auto">
          {notes.map((note: Note, index: number) => {
            return (
              <FilePreview
                key={index}
                note={note}
                isActive={activeNote ? activeNote.id === note.id : false}
                setActiveNote={setActiveNote}
                DeleteNote={DeleteNote}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
