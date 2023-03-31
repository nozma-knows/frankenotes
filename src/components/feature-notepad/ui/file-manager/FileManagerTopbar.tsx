import { useState } from "react";
import { LexicalEditor } from "lexical";
import { Note } from "@/__generated__/graphql";
import { $getRoot } from "lexical";
import {
  BsQuestionLg,
  BsPlusLg,
  BsChevronLeft,
  BsChevronDown,
} from "react-icons/bs";
import QueryNotesPopup from "@/components/feature-ai/ui/popups/QueryNotesPopup";
import FileManagerTopbarButton from "./FileManagerTopbarButton";

export default function FileManagerTopbar({
  editor,
  size,
  authorId,
  notes,
  CreateNote,
  setFileManagerOpen,
}: {
  editor: LexicalEditor;
  size: string;
  authorId: string;
  notes: Note[];
  CreateNote: any;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) {
  const createNewNote = () => {
    editor.update(() => {
      $getRoot().clear();
    });
    CreateNote();
  };

  const [showQueryNotesPopup, setShowQueryNotesPopup] = useState(false);

  return (
    <div className="flex w-full p-2 rounded-t-xl">
      {showQueryNotesPopup && (
        <QueryNotesPopup
          notes={notes}
          authorId={authorId}
          onClose={() => setShowQueryNotesPopup(false)}
        />
      )}
      <div className="flex gap-1 sm:gap-4 items-center justify-end w-full">
        <div className="flex w-full gap-1 justify-between items-center text-main-dark">
          <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
            <div className="flex gap-1 sm:gap-4">
              <FileManagerTopbarButton
                Icon={BsQuestionLg}
                onClick={() => setShowQueryNotesPopup(true)}
                label="Ask your notes a question"
              />
            </div>
          </div>
          <div className="flex gap-1 sm:gap-4">
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <FileManagerTopbarButton
                Icon={BsPlusLg}
                onClick={() => createNewNote()}
                label="Create a new note"
              />
            </div>
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              {size != "sm" ? (
                <FileManagerTopbarButton
                  Icon={BsChevronLeft}
                  onClick={() => setFileManagerOpen(false)}
                  label="Close file manager"
                />
              ) : (
                <FileManagerTopbarButton
                  Icon={BsChevronDown}
                  onClick={() => setFileManagerOpen(false)}
                  label="Close file manager"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
