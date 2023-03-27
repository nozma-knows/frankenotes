import { useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UpdateNoteMutation } from "@/components/graph";
import NoteContext from "../../context/useNoteContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Note } from "@/__generated__/graphql";

export default function SaveToDBPlugin() {
  const [editor] = useLexicalComposerContext();

  const { activeNote } = useContext(NoteContext);

  // Update note mutation
  const [updateNote] = useMutation(UpdateNoteMutation, {
    onCompleted: ({ updateNote }) => {},
    onError: () => console.log("error!"),
  });

  useEffect(() => {
    // Function for calling update note mutation
    const UpdateNote = ({
      note,
      editorState,
    }: {
      note: Note;
      editorState: string;
    }) => {
      const { id, authorId, title } = note;
      updateNote({
        variables: {
          id,
          input: {
            authorId,
            title,
            editorState,
          },
        },
      });
    };
    const interval = setInterval(() => {
      if (!activeNote) return;
      const editorState = JSON.stringify(editor.getEditorState());
      UpdateNote({ note: activeNote, editorState });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeNote, editor, updateNote]);
  return null;
}
