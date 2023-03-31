import { useContext } from "react";
import NoteContext from "./context/useNoteContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import TextEditor from "./ui/TextEditor";
import FileManager from "./ui/file-manager";

// Nodes available to editor
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
  // Grab vars from context
  const { fileManagerOpen } = useContext(NoteContext);

  // Editor error handler
  // Note - Need to improve this
  function onError(error: Error) {
    console.error(error);
  }

  // Initial config for editor
  const initialConfig = {
    namespace: "MyEditor",
    onError,
    nodes: EDITOR_NODES,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col sm:flex-row w-full h-full gap-2 p-2">
        <div className="flex h-full w-full overflow-hidden">
          <TextEditor />
        </div>
        {fileManagerOpen && (
          <div className="flex h-fit sm:h-full sm:order-first">
            <FileManager />
          </div>
        )}
      </div>
    </LexicalComposer>
  );
}
