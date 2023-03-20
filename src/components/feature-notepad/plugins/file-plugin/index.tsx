import { useEffect } from "react";
import { Note } from "@/__generated__/graphql";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";

interface FilePluginProps {
  // activeFile: Note | null;
  activeFile: any;
}

export function FilePlugin({ activeFile }: FilePluginProps) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      if (activeFile) {
        const content = activeFile ? activeFile.content : "";
        $convertFromMarkdownString(content);
      }
    });
  }, [editor, activeFile]);

  return null;
}
