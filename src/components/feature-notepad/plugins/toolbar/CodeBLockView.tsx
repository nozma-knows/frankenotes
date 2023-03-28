import { getLanguageFriendlyName } from "@lexical/code";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";
import { CODE_LANGUAGE_OPTIONS } from "../../store";

export default function CodeBlockView({
  isEditable,
  codeLanguage,
  onCodeLanguageSelect,
}: {
  isEditable: boolean;
  codeLanguage: string;
  onCodeLanguageSelect: any;
}) {
  return (
    <>
      <DropDown
        disabled={!isEditable}
        buttonClassName="toolbar-item code-language"
        buttonLabel={getLanguageFriendlyName(codeLanguage)}
        buttonAriaLabel="Select language"
      >
        {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
          return (
            <DropDownItem
              key={value}
              onClick={() => onCodeLanguageSelect(value)}
              label={name}
            />
          );
        })}
      </DropDown>
    </>
  );
}
