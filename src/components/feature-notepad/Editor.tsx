import { useContext } from "react";
import NoteContext from "./context/useNoteContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import TextEditor from "./ui/TextEditor";
import FileManager from "./ui/FileManager";

const theme = {
  // Theme styling goes here
};

export default function Editor() {
  function onError(error: Error) {
    console.error(error);
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  const { activeNote } = useContext(NoteContext);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col sm:flex-row w-full h-full gap-2 p-2">
        <TextEditor />
        <FileManager />
      </div>
    </LexicalComposer>
  );
}
