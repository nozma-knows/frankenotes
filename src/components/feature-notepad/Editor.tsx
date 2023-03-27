import { useContext } from "react";
import NoteContext from "./context/useNoteContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import TextEditor from "./ui/TextEditor";
import FileManager from "./ui/FileManager";

const theme = {
  // Theme styling goes here
};

const EDITOR_NODES = [
  AutoLinkNode,
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];
export default function Editor() {
  function onError(error: Error) {
    console.error(error);
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: EDITOR_NODES,
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
