import { LexicalEditor } from "lexical";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import { BsTrash } from "react-icons/bs";
import EditorButton from "../../ui/buttons/EditorButton";

export default function DeleteView({
  canDelete,
  activeEditor,
}: {
  canDelete: boolean;
  activeEditor: LexicalEditor;
}) {
  return (
    <div className={`flex gap-2 text-2xl ${!canDelete && "opacity-50"}`}>
      <EditorButton
        Icon={BsTrash}
        label="Delete"
        disabled={!canDelete}
        onClick={() => {
          activeEditor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
          activeEditor.focus();
        }}
      />
    </div>
  );
}
