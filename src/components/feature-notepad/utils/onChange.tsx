import { useContext } from "react";
import NoteContext from "@/components/feature-notepad/context/useNoteContext";
import { useMutation } from "@apollo/client";
import { CreateNoteMutation } from "@/components/graph";
import { EditorState } from "lexical";
import { Note } from "@/__generated__/graphql";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export default function OnChange(
  authorId: string,
  editorState: EditorState,
  activeNote: Note | null,
  setActiveNote: (activeNote: Note | null) => void,
  refetchNotes: () => Promise<any>
) {
  // const [editor] = useLexicalComposerContext();
  // editorState = editor.parseEditorState(editorState);
  console.log("editorState: ", editorState);

  // Create note mutation
  const [createNote] = useMutation(CreateNoteMutation, {
    onCompleted: (data: { createNote: Note }) => {
      refetchNotes();
      setActiveNote(data.createNote);
    },
    onError: () => console.log("error!"),
  });
  // Function for calling create note mutation
  const CreateNote = (editorState: EditorState) => {
    const input = {
      authorId,
      editorState,
    };
    createNote({
      variables: {
        input,
      },
    });
  };

  if (editorState) {
    editorState.read(() => {
      const root = $getRoot();

      const isEmpty =
        !root.getFirstChild() ||
        (root.getFirstChild()?.isEmpty() && root.getChildrenSize() === 1);

      if (activeNote) {
        setActiveNote({
          ...activeNote,
          editorState: JSON.stringify(editorState),
        });
      } else if (!isEmpty) {
        console.log("Shit aint empty dawg");
        CreateNote(editorState);
      }
    });
  }
}
