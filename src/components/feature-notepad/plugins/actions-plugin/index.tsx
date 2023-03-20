/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { MouseEventHandler } from "react";
import type { LexicalEditor } from "lexical";

import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { exportFile, importFile } from "@lexical/file";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { CONNECTED_COMMAND, TOGGLE_CONNECT_COMMAND } from "@lexical/yjs";
import {
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import useModal from "@/components/utils/hooks/useModal";
// import Button from "../../ui/Button";
import { PLAYGROUND_TRANSFORMERS } from "../markdown-transformers";
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "../spech-to-text";

import {
  BsMic,
  BsUpload,
  BsDownload,
  BsTrash,
  BsLockFill,
  BsUnlockFill,
  BsMarkdown,
} from "react-icons/bs";
import { IconType } from "react-icons";

async function sendEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  try {
    await fetch("http://localhost:1235/setEditorState", {
      body: stringifiedEditorState,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      method: "POST",
    });
  } catch {
    // NO-OP
  }
}

async function validateEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  let response = null;
  try {
    response = await fetch("http://localhost:1235/validateEditorState", {
      body: stringifiedEditorState,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      method: "POST",
    });
  } catch {
    // NO-OP
  }
  if (response !== null && response.status === 403) {
    throw new Error(
      "Editor state validation failed! Server did not accept changes."
    );
  }
}

interface ActionsPluginButtonProps {
  Icon: IconType;
  ariaLabel: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const ActionsPluginButton = ({
  Icon,
  ariaLabel,
  onClick,
}: ActionsPluginButtonProps) => {
  return (
    <div
      className="hover:bg-[#1e2626] p-2 rounded-full cursor-pointer"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon />
    </div>
  );
};

export default function ActionsPlugin({
  isRichText,
}: {
  isRichText: boolean;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [modal, showModal] = useModal();
  const { isCollabActive } = useCollaborationContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerCommand<boolean>(
        CONNECTED_COMMAND,
        (payload) => {
          const isConnected = payload;
          setConnected(isConnected);
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ dirtyElements, prevEditorState, tags }) => {
        // If we are in read only mode, send the editor state
        // to server and ask for validation if possible.
        if (
          !isEditable &&
          dirtyElements.size > 0 &&
          !tags.has("historic") &&
          !tags.has("collaboration")
        ) {
          validateEditorState(editor);
        }
        editor.getEditorState().read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);
          } else {
            if ($isParagraphNode(children[0])) {
              const paragraphChildren = children[0].getChildren();
              setIsEditorEmpty(paragraphChildren.length === 0);
            } else {
              setIsEditorEmpty(false);
            }
          }
        });
      }
    );
  }, [editor, isEditable]);

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === "markdown") {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          PLAYGROUND_TRANSFORMERS
        );
      } else {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
        root
          .clear()
          .append(
            $createCodeNode("markdown").append($createTextNode(markdown))
          );
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <div className="flex p-2 gap-2 justify-end items-center">
      {SUPPORT_SPEECH_RECOGNITION && (
        <ActionsPluginButton
          Icon={BsMic}
          ariaLabel={`${isSpeechToText ? "Enable" : "Disable"} speech to text`}
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
          }}
        />
      )}
      <ActionsPluginButton
        Icon={BsUpload}
        ariaLabel="Import editor state from JSON"
        onClick={() => importFile(editor)}
      />
      <ActionsPluginButton
        Icon={BsDownload}
        ariaLabel="Import editor state from JSON"
        onClick={() =>
          exportFile(editor, {
            fileName: `Playground ${new Date().toISOString()}`,
            source: "Playground",
          })
        }
      />
      <ActionsPluginButton
        Icon={BsTrash}
        ariaLabel="Clear editor contents"
        onClick={() => {
          showModal("Clear editor", (onClose) => (
            <ShowClearDialog editor={editor} onClose={onClose} />
          ));
        }}
      />
      <ActionsPluginButton
        Icon={!isEditable ? BsUnlockFill : BsLockFill}
        ariaLabel={`${!isEditable ? "Unlock" : "Lock"} read-only mode`}
        onClick={() => {
          if (isEditable) {
            sendEditorState(editor);
          }
          editor.setEditable(!editor.isEditable());
        }}
      />
      <ActionsPluginButton
        Icon={BsMarkdown}
        ariaLabel="Convert from markdown"
        onClick={handleMarkdownToggle}
      />
      {modal}
    </div>
  );
}

function ShowClearDialog({
  editor,
  onClose,
}: {
  editor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  return (
    <>
      Are you sure you want to clear the editor?
      <div className="Modal__content">
        <button
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor.focus();
            onClose();
          }}
        >
          Clear
        </button>{" "}
        <button
          onClick={() => {
            editor.focus();
            onClose();
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
