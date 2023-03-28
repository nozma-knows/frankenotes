import { useContext } from "react";
import NoteContext from "../../context/useNoteContext";
import { BsPlus, BsChevronRight, BsChevronUp } from "react-icons/bs";
import EditorButton from "../../ui/buttons/EditorButton";

export default function FilesView() {
  const { size, setFileManagerOpen } = useContext(NoteContext);
  return (
    <div className="flex flex-col gap-2">
      <EditorButton
        Icon={BsPlus}
        label="Create new file"
        disabled={false}
        onClick={() => console.log("Create file button clicked.")}
        className="flex items-center justify-center button bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]"
        iconSize="text-4xl"
      />
      <EditorButton
        Icon={size !== "sm" ? BsChevronRight : BsChevronUp}
        label="Open file manager"
        disabled={false}
        onClick={() => setFileManagerOpen(true)}
        className="flex items-center justify-center button bg-tertiary-dark p-2 rounded-lg h-[54px] w-[54px]"
        iconSize="text-2xl"
      />
    </div>
  );
}
