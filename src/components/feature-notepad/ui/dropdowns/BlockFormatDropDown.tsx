import type { LexicalEditor } from "lexical";
import { blockTypeToBlockName, blockTypeToBlockIcon } from "../../store";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode } from "@lexical/code";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";

export default function BlockFormatDropDown({
  editor,
  blockType,
  disabled,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $wrapNodes(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $wrapNodes(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      Icon={blockTypeToBlockIcon[blockType]}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropDownItem
        onClick={formatParagraph}
        Icon={blockTypeToBlockIcon["paragraph"]}
        label="Normal"
      />
      <DropDownItem
        onClick={() => formatHeading("h1")}
        Icon={blockTypeToBlockIcon["h1"]}
        label="Heading 1"
      />
      <DropDownItem
        onClick={() => formatHeading("h2")}
        Icon={blockTypeToBlockIcon["h2"]}
        label="Heading 2"
      />
      <DropDownItem
        onClick={() => formatHeading("h3")}
        Icon={blockTypeToBlockIcon["h3"]}
        label="Heading 3"
      />
      <DropDownItem
        onClick={formatBulletList}
        Icon={blockTypeToBlockIcon["bullet"]}
        label="Bullet List"
      />
      <DropDownItem
        onClick={formatNumberedList}
        Icon={blockTypeToBlockIcon["number"]}
        label="Numbered List"
      />
      <DropDownItem
        onClick={formatCheckList}
        Icon={blockTypeToBlockIcon["check"]}
        label="Check List"
      />
      <DropDownItem
        onClick={formatQuote}
        Icon={blockTypeToBlockIcon["quote"]}
        label="Quote"
      />
      <DropDownItem
        onClick={formatCode}
        Icon={blockTypeToBlockIcon["code"]}
        label="Code Block"
      />
    </DropDown>
  );
}
