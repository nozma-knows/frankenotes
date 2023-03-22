import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UpdateNoteMutation, CreateNoteMutation } from "@/components/graph";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import SpeechToTextPlugin from "../../plugins/spech-to-text";
import ToolbarPlugin from "../../plugins/toolbar-plugin";
import { FilePlugin } from "../../plugins/file-plugin";
import { Note } from "@/__generated__/graphql";
import { useEditorHistoryState } from "../../plugins/toolbar-plugin/context/EditorHistoryState";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LinkPlugin from "../../plugins/link-plugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import PlaygroundAutoLinkPlugin from "../../plugins/auto-link-plugin";
import FloatingLinkEditorPlugin from "../../plugins/floating-link-editor-plugin";
import DetailsPlugin from "../../plugins/details-plugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import DraggableBlockPlugin from "../../plugins/DraggableBlockPlugin";
import { EditorState } from "lexical";
import { ApolloQueryResult } from "@apollo/client";
import useWindowSize, {
  smScreenMax,
  mdScreenMax,
  lgScreenMax,
} from "@/components/utils/hooks/useWindowSize";

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>["0"]["initialConfig"];
  activeFile: Note | null;
  setActiveFile: (activeFile: Note | null) => void;
  authorId: string;
  refetch: (
    variables?: Partial<{ authorId: string | undefined }> | undefined
  ) => Promise<ApolloQueryResult<any>>;
  fileManagerOpen: boolean;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
};

export default function LexicalEditor({
  config,
  activeFile,
  setActiveFile,
  authorId,
  refetch,
  fileManagerOpen,
  setFileManagerOpen,
}: LexicalEditorProps) {
  const [size, setSize] = useState("lg");

  const windowSize = useWindowSize();

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

  const { historyState } = useEditorHistoryState();

  const onChange = (
    data: EditorState,
    activeFile: Note | null,
    setMarkdownContent: (markdownContent: string) => void
  ) => {
    const dataJSON = data.toJSON();
    const isEmpty = dataJSON.root.direction === null;
    if (!activeFile && !isEmpty) {
      const content = data.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        setMarkdownContent(markdown);
        return markdown;
      });
      if (content.length <= 1) {
        CreateNote({ content: content });
      }
    }
    const updatedContent = data.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      setMarkdownContent(markdown);
      return markdown;
    });
    if (activeFile && updatedContent) {
      UpdateNote({ note: activeFile, updatedContent });
    }
  };

  // useMutaiton call for creating a note
  const [createNote, { loading: loadingNote, error: errorGrabbingNote }] =
    useMutation(CreateNoteMutation, {
      onCompleted: (data: { createNote: Note }) => {
        console.log("createNote: ", data.createNote);
        refetch();
        setActiveFile(data.createNote);
      },
      onError: () => console.log("error!"),
    });

  const CreateNote = ({ content }: { content: string }) => {
    const input = {
      authorId,
      content,
    };
    createNote({
      variables: {
        input,
      },
    });
  };

  // useMutaiton call for updating a note
  const [
    updateNote,
    { loading: loadingUpdateNote, error: errorUpdateingNote },
  ] = useMutation(UpdateNoteMutation, {
    onCompleted: ({ updateNote }) => {},
    onError: () => console.log("error!"),
  });

  const UpdateNote = ({
    note,
    updatedContent,
  }: {
    note: Note;
    updatedContent: string;
  }) => {
    const { id, authorId, title } = note;
    updateNote({
      variables: {
        id,
        input: {
          authorId,
          title,
          content: updatedContent,
        },
      },
    });
  };

  const [markdownContent, setMarkdownContent] = useState("");

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = window.matchMedia(
        "(max-width: 1025px)"
      ).matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };

    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <LexicalComposer initialConfig={config}>
      <div className="flex w-full gap-2">
        <div className="flex flex-col w-full bg-main-light rounded-xl">
          <ToolbarPlugin size={size} fileManagerOpen={fileManagerOpen} />
          <DetailsPlugin
            size={size}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            fileManagerOpen={fileManagerOpen}
            setFileManagerOpen={setFileManagerOpen}
          />
          <div className="flex h-full w-full overflow-y-auto">
            <RichTextPlugin
              contentEditable={
                <div ref={onRef} className="flex w-full">
                  <ContentEditable
                    className="flex h-full p-4 max-h-min flex-col w-full outline-none overflow-y-auto text-main-light editor"
                    value={markdownContent}
                  />
                  {/* <ContentEditable className="editor" value={markdownContent} /> */}
                </div>
              }
              placeholder={<></>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <ClearEditorPlugin />
          <HistoryPlugin externalHistoryState={historyState} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ListPlugin />
          <CheckListPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <PlaygroundAutoLinkPlugin />
          <OnChangePlugin
            onChange={(data) => onChange(data, activeFile, setMarkdownContent)}
          />
          <FilePlugin activeFile={activeFile} />
          <SpeechToTextPlugin />
          <TabIndentationPlugin />

          {floatingAnchorElem && !isSmallWidthViewport && (
            <>
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            </>
          )}
          {floatingAnchorElem && (
            <>
              <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
            </>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
