import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import {
  $getRoot,
  $isParagraphNode,
  $getSelection,
  CLEAR_EDITOR_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  FaTrashAlt,
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaStrikethrough,
  FaSuperscript,
  FaSubscript,
} from "react-icons/fa";
import { BsTextParagraph, BsChatSquareQuote } from "react-icons/bs";
import ToolbarButton from "./ToolbarButton";
import ToolbarDropdown from "./ToolbarDropdown";
import { useEditorHistoryState } from "./context/EditorHistoryState";
import AutocompleteField from "@/components/ui/form-fields/AutocompleteField";

const BlockLabel = ({ Icon, label }: { Icon: any; label: string }) => (
  <div className="flex gap-2 items-center">
    <Icon /> {label}
  </div>
);

const BlockTypes = [
  {
    label: `Normal`,
    value: "paragraph",
  },
  {
    label: `Large Heading`,
    value: "h1",
  },
  {
    label: `Small Heading`,
    value: "h2",
  },
  {
    label: `Bulleted List`,
    value: "ul",
  },
  {
    label: `Numbered List`,
    value: "ol",
  },
  {
    label: `Quote`,
    value: "blockquote",
  },
  {
    label: `Code Block`,
    value: "code",
  },
];

const Fonts = [
  {
    label: "Arial",
    value: "arial",
  },
  {
    label: "Courier New",
    value: "courier-new",
  },
  {
    label: "Georgia",
    value: "georgia",
  },
  {
    label: "Times New Roman",
    value: "times-new-roman",
  },
  {
    label: "Trebuchet MS",
    value: "trebuchet-ms",
  },
  {
    label: "Verdana",
    value: "verdana",
  },
];

const FontSizes = [
  {
    label: "10px",
    value: 10,
  },
  {
    label: "11px",
    value: 11,
  },
  {
    label: "12px",
    value: 12,
  },
  {
    label: "13px",
    value: 13,
  },
  {
    label: "14px",
    value: 14,
  },
  {
    label: "15px",
    value: 15,
  },
  {
    label: "16px",
    value: 16,
  },
  {
    label: "17px",
    value: 17,
  },
  {
    label: "18px",
    value: 18,
  },
  {
    label: "19px",
    value: 19,
  },
  {
    label: "20px",
    value: 20,
  },
];

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}: any) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown: any = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown: any = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className="dropdown" ref={dropDownRef}>
      <button className="item" onClick={formatParagraph}>
        <span className="icon paragraph" />
        <span className="text">Normal</span>
        {blockType === "paragraph" && <span className="active" />}
      </button>
      <button className="item" onClick={formatLargeHeading}>
        <span className="icon large-heading" />
        <span className="text">Large Heading</span>
        {blockType === "h1" && <span className="active" />}
      </button>
      <button className="item" onClick={formatSmallHeading}>
        <span className="icon small-heading" />
        <span className="text">Small Heading</span>
        {blockType === "h2" && <span className="active" />}
      </button>
      <button className="item" onClick={formatBulletList}>
        <span className="icon bullet-list" />
        <span className="text">Bullet List</span>
        {blockType === "ul" && <span className="active" />}
      </button>
      <button className="item" onClick={formatNumberedList}>
        <span className="icon numbered-list" />
        <span className="text">Numbered List</span>
        {blockType === "ol" && <span className="active" />}
      </button>
      <button className="item" onClick={formatQuote}>
        <span className="icon quote" />
        <span className="text">Quote</span>
        {blockType === "quote" && <span className="active" />}
      </button>
      <button className="item" onClick={formatCode}>
        <span className="icon code" />
        <span className="text">Code Block</span>
        {blockType === "code" && <span className="active" />}
      </button>
    </div>
  );
}

export function ToolbarPlugin() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FieldValues>();

  // const { isPointerDown, isKeyDown } = useUserInteractions();
  const [editor] = useLexicalComposerContext();
  const { historyState } = useEditorHistoryState();

  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const { undoStack, redoStack } = historyState ?? {};
  const [hasUndo, setHasUndo] = useState(undoStack?.length !== 0);
  const [hasRedo, setHasRedo] = useState(redoStack?.length !== 0);
  const [blockType, setBlockType] = useState("paragraph");

  useEffect(() => {
    switch (blockType) {
      case "paragraph":
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createParagraphNode());
          }
        });
        break;
      case "h1":
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createHeadingNode("h1"));
          }
        });
        break;
      case "h2":
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createHeadingNode("h2"));
          }
        });
        break;
      case "ul":
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
      case "ol":
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;
      case "blockquote":
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createQuoteNode());
          }
        });
        break;
      case "code":
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createCodeNode());
          }
        });
        break;
      default:
        break;
    }
  }, [blockType, editor]);

  const [isBold, setIsBold] = useState(false);
  // const [isCode, setIsCode] = useState(false);
  // const [isLink, setIsLink] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [align, setAlign] = useState("left");
  // const [isStrikethrough, setIsStrikethrough] = useState(false);

  const MandatoryPlugins = useMemo(() => {
    return <ClearEditorPlugin />;
  }, []);

  // Check if editor is empty
  useEffect(
    function checkEditorEmptyState() {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);
            return;
          }

          if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        });
      });
    },
    [editor]
  );

  // Check editor history
  useEffect(
    function checkEditorHistoryActions() {
      return editor.registerUpdateListener((state) => {
        setHasRedo(redoStack?.length !== 0);
        setHasUndo(undoStack?.length !== 0);
      });
    },
    [editor, undoStack, redoStack]
  );

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection: any = $getSelection();
      if (selection) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setIsSubscript(selection.hasFormat("subscript"));
        setIsSuperscript(selection.hasFormat("superscript"));
      }
    });
  }, [editor]);

  // Rerender the floating menu automatically on every state update.
  // Needed to show correct state for active formatting state.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateToolbar();
    });
  }, [editor, updateToolbar]);

  const Divider = () => {
    return <div className="w-0.5 h-8 bg-white" />;
  };

  return (
    <>
      {MandatoryPlugins}
      <div className="flex items-center gap-4 md:gap-8 w-full justify-center h-16 px-4 border-2 border-b-0 rounded-t-xl bg-tertiary-dark">
        <div className="flex items-center gap-4 md:gap-8 w-fit justify-start">
          <ToolbarButton
            disabled={isEditorEmpty}
            editor={editor}
            command={CLEAR_EDITOR_COMMAND}
            Icon={FaTrashAlt}
            label="Delete"
          />
          <Divider />
          <ToolbarButton
            disabled={!hasUndo}
            editor={editor}
            command={UNDO_COMMAND}
            Icon={FaUndo}
            label="Undo (⌘Z)"
          />
          <ToolbarButton
            disabled={!hasRedo}
            editor={editor}
            command={REDO_COMMAND}
            Icon={FaRedo}
            label="Redo (⇧⌘Z)"
          />
        </div>
        <div className="flex items-center gap-4 md:gap-8 w-full justify-start ">
          <Divider />
          <ToolbarDropdown
            id="block-type"
            label="Block Type"
            options={BlockTypes}
            onChange={(value: { label: string; value: string }) => {
              if (value) {
                setBlockType(value.value);
              } else {
                setBlockType("paragraph");
              }
            }}
          />
        </div>

        {/* <ToolbarDropdown id="font" label="Font" options={Fonts} /> */}
        {/* <Divider /> */}
        {/* <ToolbarDropdown id="font-size" label="Font Size" options={FontSizes} /> */}
        {/* <Divider /> */}
        {blockType === "code" ? (
          <></>
        ) : (
          <div className="hidden md:flex gap-4 md:gap-8 w-full justify-end">
            <Divider />
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="bold"
              Icon={FaBold}
              label="Bold (⌘B)"
              active={isBold}
            />
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="italic"
              Icon={FaItalic}
              label="Italic (⌘I)"
              active={isItalic}
            />
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="underline"
              Icon={FaUnderline}
              label="Underline (⌘U)"
              active={isUnderline}
            />
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="strikethrough"
              Icon={FaStrikethrough}
              label="Strikethrough"
              active={isStrikethrough}
            />
            {/* <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="subscript"
              Icon={FaSubscript}
              label="Subscript"
              active={isSubscript}
            />
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="superscript"
              Icon={FaSuperscript}
              label="Superscript"
              active={isSuperscript}
            /> */}
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="underline"
              Icon={FaCode}
              label="Insert code block"
            />
            <ToolbarButton
              editor={editor}
              command={FORMAT_TEXT_COMMAND}
              property="underline"
              Icon={FaLink}
              label="Insert code block"
            />
            <Divider />
            <ToolbarButton
              disabled={isEditorEmpty}
              editor={editor}
              command={FORMAT_ELEMENT_COMMAND}
              property="left"
              Icon={FaAlignLeft}
              label="Left align"
            />
            <ToolbarButton
              disabled={isEditorEmpty}
              editor={editor}
              command={FORMAT_ELEMENT_COMMAND}
              property="center"
              Icon={FaAlignCenter}
              label="Center"
            />
            <ToolbarButton
              disabled={isEditorEmpty}
              editor={editor}
              command={FORMAT_ELEMENT_COMMAND}
              property="right"
              Icon={FaAlignRight}
              label="Right align"
            />
            <ToolbarButton
              disabled={isEditorEmpty}
              editor={editor}
              command={FORMAT_ELEMENT_COMMAND}
              property="justify"
              Icon={FaAlignJustify}
              label="Justify"
            />
          </div>
        )}
      </div>
    </>
  );
}
