import { LexicalEditor } from "lexical";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { BsArrowCounterclockwise, BsArrowClockwise } from "react-icons/bs";
import ToolbarButton from "../buttons/ToolbarButton";

export default function HistoryView({
  canUndo,
  canRedo,
  activeEditor,
  isEditable,
}: {
  canUndo: boolean;
  canRedo: boolean;
  activeEditor: LexicalEditor;
  isEditable: boolean;
}) {
  return (
    <div className={`flex gap-2 text-2xl ${!canUndo && "opacity-50"}`}>
      <ToolbarButton
        Icon={BsArrowCounterclockwise}
        label="Undo (⌘Z)"
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      />
      <ToolbarButton
        Icon={BsArrowClockwise}
        label="Redo (⌘Y)"
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      />
    </div>
  );
}