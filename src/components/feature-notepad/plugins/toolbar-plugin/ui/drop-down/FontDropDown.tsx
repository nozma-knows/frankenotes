import React, { useCallback } from "react";
import type { LexicalEditor } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { BsFonts } from "react-icons/bs";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from "../../store";

export default function FontDropDown({
  editor,
  value,
  style,
  disabled,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const buttonAriaLabel =
    style === "font-family"
      ? "Formatting options for font family"
      : "Formatting options for font size";

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={"toolbar-item " + style}
      buttonLabel={value}
      {...(style === "font-family" && { Icon: BsFonts })}
      buttonAriaLabel={buttonAriaLabel}
    >
      {(style === "font-family" ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            key={option}
            onClick={() => handleClick(option)}
            label={text}
          />
        )
      )}
    </DropDown>
  );
}
