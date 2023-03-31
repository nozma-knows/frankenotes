import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor } from "lexical";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { Note } from "@/__generated__/graphql";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";

// Function for updating the active note
const handleUpdateActiveNote = (
  note: Note,
  setActiveNote: (activeNote: Note | null) => void,
  editor: LexicalEditor
) => {
  setActiveNote(note);
};

// File preview props
interface FilePreviewProps {
  note: Note;
  isActive: boolean;
  setActiveNote: (activeNote: Note | null) => void;
  DeleteNote: ({ note }: { note: Note }) => void;
}

export default function FilePreview({
  note,
  isActive,
  setActiveNote,
  DeleteNote,
}: FilePreviewProps) {
  const { title } = note;
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex items-center justify-between px-2 my-0.5">
      <div
        className={`flex w-full items-center justify-between p-2 gap-2 rounded-lg cursor-pointer hover:bg-[#1e2626] hover:text-[#e3d1e6] ${
          isActive ? "bg-tertiary-dark text-main-dark" : "text-main-light"
        }`}
      >
        <div
          className="truncate pr-4 w-full"
          onClick={() => handleUpdateActiveNote(note, setActiveNote, editor)}
        >
          {title || "Untitled"}
        </div>
        <DropDown
          className="flex text-3xl button"
          disabled={false}
          buttonClassName="toolbar-item block-controls"
          Icon={BsThreeDots}
          buttonLabel="Profile"
          buttonAriaLabel="Profile button"
          noArrow
          round
        >
          <DropDownItem
            onClick={() => DeleteNote({ note })}
            Icon={BsTrash}
            label="Delete Note"
          />
        </DropDown>
      </div>
    </div>
  );
}
