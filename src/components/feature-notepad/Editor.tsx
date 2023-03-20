// import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { Note } from "@/__generated__/graphql";
import LexicalEditor from "./editors/lexical-editor";
import theme from "./editors/lexical-editor/theme";
import { EditorHistoryStateContext } from "./plugins/toolbar-plugin/context/EditorHistoryState";
import { ApolloQueryResult } from "@apollo/client";

const EDITOR_NODES = [
  AutoLinkNode,
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

export default function Editor({
  activeFile,
  setActiveFile,
  authorId,
  refetch,
  fileManagerOpen,
  setFileManagerOpen,
}: {
  activeFile: Note | null;
  setActiveFile: (activeFile: Note | null) => void;
  authorId: string;
  refetch: (
    variables?: Partial<{ authorId: string | undefined }> | undefined
  ) => Promise<ApolloQueryResult<any>>;
  fileManagerOpen: boolean;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) {
  return (
    <div id="editor-wrapper" className={"flex w-full h-full"}>
      <EditorHistoryStateContext>
        <LexicalEditor
          config={{
            namespace: "lexical-editor",
            nodes: EDITOR_NODES,
            theme,
            onError: (error) => {
              console.log(error);
            },
          }}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          authorId={authorId}
          refetch={refetch}
          fileManagerOpen={fileManagerOpen}
          setFileManagerOpen={setFileManagerOpen}
        />
      </EditorHistoryStateContext>
    </div>
  );
}
