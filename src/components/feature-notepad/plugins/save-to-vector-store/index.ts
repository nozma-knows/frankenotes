import { useContext, useEffect, useCallback } from "react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UpdateNoteMutation } from "@/components/graph";
import NoteContext from "../../context/useNoteContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { Note } from "@/__generated__/graphql";

export default function SaveToDBPlugin() {
  const [editor] = useLexicalComposerContext();

  const { authorId, activeNote } = useContext(NoteContext);

  const [lastFileUpdate, setLastFileUpdate] = useState(
    activeNote?.updatedAt || 0
  );

  const [lastVectorStoreUpdate, setLastVectorStoreUpdate] = useState(0);

  const handleSaveToVectorStore = useCallback(
    async ({ docId, doc }: { docId: string; doc: string }) => {
      try {
        if (doc) {
          const response = await fetch(`../api/save-to-vector-store`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              message: "Test message!!",
            }),
          });
        }
      } catch (error) {
        console.error("Error submitting prompt: ", error);
      }
    },
    []
  );

  useEffect(() => {
    const time = new Date();
    setLastFileUpdate(time.valueOf());
  }, [activeNote]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeNote) return;
      if (Number(lastFileUpdate) > Number(lastVectorStoreUpdate)) {
        setLastVectorStoreUpdate(new Date().valueOf());
        const editorState = editor.getEditorState();
        editorState.read(() => {
          const root = $getRoot();
          const content = root.getTextContent();
          console.log("content: ", content);
          handleSaveToVectorStore({
            docId: activeNote.id,
            doc: content,
          });
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  });
  return null;
}
