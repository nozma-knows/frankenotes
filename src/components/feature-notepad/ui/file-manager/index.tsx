/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import { CreateNoteMutation, DeleteNoteMutation } from "@/components/graph";
import { Note } from "@/__generated__/graphql";
import NoteContext from "../../context/useNoteContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, CLEAR_EDITOR_COMMAND } from "lexical";
import Logo from "@/components/ui/icons/Logo";
import FrankenotesLogo from "@/icons/logo.svg";
import { deleteVectorStore } from "../../utils/deleteVectorStore";
import FileManagerTopbar from "./FileManagerTopbar";
import FilePreview from "./FilePreview";

const title = `Frankenotes`;

const emptyEditorState =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

export default function FileManager() {
  // Grab editor state
  const [editor] = useLexicalComposerContext();

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

  // Update editor when user selects a new note
  useEffect(() => {
    if (activeNote?.id) {
      editor.setEditorState(editor.parseEditorState(activeNote.editorState));
    }
  }, [activeNote?.id, editor]);

  // MUTATIONS
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
  const [deleteNote] = useMutation(DeleteNoteMutation, {
    onCompleted: (data: { deleteNote: Note }) => {
      const editorState = editor.getEditorState();
      editorState.read(() => {
        const root = $getRoot();
        const content = root.getTextContent();
        const docId = data.deleteNote.id as string;
        const doc = content as string;
        deleteVectorStore({ authorId, docId, doc });
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
    <div className="flex flex-col w-full h-full sm:w-[16rem] md:w-[21rem] max-h-72 sm:max-h-none">
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
