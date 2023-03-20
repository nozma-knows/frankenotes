import { LexicalEditor } from "lexical";
import BlockFormatDropDown from "../drop-down/BlockFormatDropDown";
import { blockTypeToBlockName } from "../../store";

export default function BlockTypeView({
  blockType,
  activeEditor,
  editor,
  isEditable,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  activeEditor: LexicalEditor;
  editor: LexicalEditor;
  isEditable: boolean;
}) {
  return (
    <div>
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <BlockFormatDropDown
          disabled={!isEditable}
          blockType={blockType}
          editor={editor}
        />
      )}
    </div>
  );
}
