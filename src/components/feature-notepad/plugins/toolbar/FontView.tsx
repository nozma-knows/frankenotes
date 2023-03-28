import { useContext } from "react";
import NoteContext from "../../context/useNoteContext";
import { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsCode,
  BsLink,
  BsPaintBucket,
  BsType,
  BsTypeStrikethrough,
  BsSubscript,
  BsSuperscript,
  BsTrash,
} from "react-icons/bs";
import { MdFormatColorText } from "react-icons/md";
import FontDropDown from "../../ui/dropdowns/FontDropDown";
import Divider from "../../ui/Divider";
import EditorButton from "../../ui/buttons/EditorButton";
import ColorPicker from "@/components/ui/form-fields/ColorPicker";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";

interface FontViewProps {
  isEditable: boolean;
  activeEditor: LexicalEditor;
  fontFamily: string;
  fontSize: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isCode: boolean;
  isLink: boolean;
  insertLink: any;
  fontColor: string;
  onFontColorSelect: any;
  bgColor: string;
  onBgColorSelect: any;
  clearFormatting: any;
}
export default function FontView(props: FontViewProps) {
  const [editor] = useLexicalComposerContext();
  const { size } = useContext(NoteContext);
  return (
    <>
      <>
        {size !== "sm" && (
          <>
            <FontDropDown
              disabled={!props.isEditable}
              style={"font-family"}
              value={props.fontFamily}
              editor={editor}
            />
            <FontDropDown
              disabled={!props.isEditable}
              style={"font-size"}
              value={props.fontSize}
              editor={editor}
            />

            <Divider />
          </>
        )}
        {size === "lg" && (
          <>
            <EditorButton
              Icon={BsTypeBold}
              label="Bold (⌘B)"
              disabled={!props.isEditable}
              active={props.isBold}
              onClick={() => {
                props.activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }}
            />
            <EditorButton
              Icon={BsTypeItalic}
              label="Italic (⌘I)"
              disabled={!props.isEditable}
              active={props.isItalic}
              onClick={() => {
                props.activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "italic"
                );
              }}
            />
            <EditorButton
              Icon={BsTypeUnderline}
              label="Underline (⌘U)"
              disabled={!props.isEditable}
              active={props.isUnderline}
              onClick={() => {
                props.activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  "underline"
                );
              }}
            />
          </>
        )}
        {size !== "sm" && (
          <>
            <EditorButton
              Icon={BsCode}
              label="Insert code block"
              disabled={!props.isEditable}
              active={props.isCode}
              onClick={() => {
                props.activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
              }}
            />
            <EditorButton
              Icon={BsLink}
              label="Insert link"
              disabled={!props.isEditable}
              active={props.isLink}
              onClick={props.insertLink}
            />
          </>
        )}

        <DropDown
          disabled={!props.isEditable}
          buttonClassName="toolbar-item spaced"
          buttonLabel=""
          buttonAriaLabel="Formatting options for additional text styles"
          Icon={BsType}
          stopCloseOnClickSelf
        >
          {size !== "lg" && (
            <>
              <DropDownItem
                Icon={BsTypeBold}
                label="Bold"
                active={props.isBold}
                onClick={() => {
                  props.activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    "bold"
                  );
                }}
              />
              <DropDownItem
                Icon={BsTypeItalic}
                label="Italic"
                active={props.isItalic}
                onClick={() => {
                  props.activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    "italic"
                  );
                }}
              />
              <DropDownItem
                Icon={BsTypeUnderline}
                label="Underline"
                active={props.isUnderline}
                onClick={() => {
                  props.activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    "underline"
                  );
                }}
              />
            </>
          )}

          <DropDownItem
            Icon={BsTypeStrikethrough}
            label="Strikethrough"
            active={props.isStrikethrough}
            onClick={() => {
              props.activeEditor.dispatchCommand(
                FORMAT_TEXT_COMMAND,
                "strikethrough"
              );
            }}
          />
          <DropDownItem
            Icon={BsSubscript}
            label="Subscript"
            active={props.isSubscript}
            onClick={() => {
              props.activeEditor.dispatchCommand(
                FORMAT_TEXT_COMMAND,
                "subscript"
              );
            }}
          />
          <DropDownItem
            Icon={BsSuperscript}
            label="Superscript"
            active={props.isSuperscript}
            onClick={() => {
              props.activeEditor.dispatchCommand(
                FORMAT_TEXT_COMMAND,
                "superscript"
              );
            }}
          />
          <DropDownItem
            Icon={BsTrash}
            label="Clear Formatting"
            onClick={props.clearFormatting}
          />
        </DropDown>
        <Divider />
        {size === "lg" && (
          <>
            <ColorPicker
              disabled={!props.isEditable}
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting text color"
              Icon={MdFormatColorText}
              color={props.fontColor}
              onChange={props.onFontColorSelect}
            />
            <ColorPicker
              disabled={!props.isEditable}
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting background color"
              Icon={BsPaintBucket}
              color={props.bgColor}
              onChange={props.onBgColorSelect}
            />
            <Divider />
          </>
        )}
      </>
    </>
  );
}
