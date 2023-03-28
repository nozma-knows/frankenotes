import { LexicalEditor } from "lexical";
import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import {
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsJustify,
  BsTextIndentLeft,
  BsTextIndentRight,
} from "react-icons/bs";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";

export default function AlignView({
  isEditable,
  activeEditor,
  isRTL,
}: {
  isEditable: boolean;
  activeEditor: LexicalEditor;
  isRTL: boolean;
}) {
  return (
    <DropDown
      disabled={!isEditable}
      buttonLabel="Align"
      Icon={BsTextLeft}
      buttonClassName="toolbar-item spaced alignment"
      buttonAriaLabel="Formatting options for text alignment"
    >
      <DropDownItem
        Icon={BsTextLeft}
        label="Left Align"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
      />
      <DropDownItem
        Icon={BsTextCenter}
        label="Center Align"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
      />
      <DropDownItem
        Icon={BsTextRight}
        label="Right Align"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
      />
      <DropDownItem
        Icon={BsJustify}
        label="Justify Align"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
      />
      <DropDownItem
        Icon={isRTL ? BsTextIndentLeft : BsTextIndentRight}
        label="Outdent"
        onClick={() => {
          activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
      />
      <DropDownItem
        Icon={isRTL ? BsTextIndentRight : BsTextIndentLeft}
        label="Indent"
        onClick={() => {
          activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
      />
    </DropDown>
  );
}
