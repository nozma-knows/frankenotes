import { useState, useEffect } from "react";
import useNoteContext from "../hooks/useNoteContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import TextEditor from "./ui/TextEditor";
import FileManager from "./ui/FileManager";
import useWindowSize, {
  smScreenMax,
  mdScreenMax,
  lgScreenMax,
} from "../utils/hooks/useWindowSize";

const theme = {
  // Theme styling goes here
};

export default function Editor() {
  const [size, setSize] = useState("lg");
  const windowSize = useWindowSize();

  const [fileManagerOpen, setFileManagerOpen] = useState(true);

  useEffect(() => {
    const { width } = windowSize;
    if (width >= lgScreenMax || (width >= mdScreenMax && !fileManagerOpen)) {
      setSize("lg");
    } else if (
      width >= mdScreenMax ||
      (width >= smScreenMax && !fileManagerOpen)
    ) {
      setSize("md");
    } else {
      setSize("sm");
    }
  }, [fileManagerOpen, size, windowSize]);

  function onError(error: Error) {
    console.error(error);
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col sm:flex-row w-full h-full bg-yellow-400">
        <TextEditor />
        <FileManager />
      </div>
    </LexicalComposer>
  );
}
