import { LexicalEditor } from "lexical";
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
import FontDropDown from "../drop-down/FontDropDown";
import Divider from "../Divider";
import ToolbarButton from "../buttons/ToolbarButton";
import ColorPicker from "@/components/ui/form-fields/ColorPicker";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";

interface FontViewProps {
  windowSize: string;
  isEditable: boolean;
  editor: LexicalEditor;
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
  console.log("props.windowSize: ", props.windowSize);
  return (
    <>
      <>
        {props.windowSize !== "sm" && (
          <>
            <FontDropDown
              disabled={!props.isEditable}
              style={"font-family"}
              value={props.fontFamily}
              editor={props.editor}
            />
            <FontDropDown
              disabled={!props.isEditable}
              style={"font-size"}
              value={props.fontSize}
              editor={props.editor}
            />

            <Divider />
          </>
        )}
        {props.windowSize === "lg" && (
          <>
            <ToolbarButton
              Icon={BsTypeBold}
              label="Bold (⌘B)"
              disabled={!props.isEditable}
              active={props.isBold}
              onClick={() => {
                props.activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }}
            />
            <ToolbarButton
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
            <ToolbarButton
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
        {props.windowSize !== "sm" && (
          <>
            <ToolbarButton
              Icon={BsCode}
              label="Insert code block"
              disabled={!props.isEditable}
              active={props.isCode}
              onClick={() => {
                props.activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
              }}
            />
            <ToolbarButton
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
        >
          {props.windowSize !== "lg" && (
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
        {props.windowSize === "lg" && (
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
