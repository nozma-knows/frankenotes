import { useState, useEffect, useContext, useCallback } from "react";
import NoteContext from "../../context/useNoteContext";
import { Note } from "@/__generated__/graphql";

const DetailsView = ({
  activeNote,
  setActiveNote,
}: {
  activeNote: Note | null;
  setActiveNote: (activeNote: Note | null) => void;
}) => {
  const [title, setTitle] = useState(
    activeNote && activeNote.title ? activeNote.title : ""
  );

  useEffect(() => {
    setTitle(activeNote && activeNote.title ? activeNote.title : "");
  }, [activeNote]);

  return (
    <div className="flex flex-1 w-full flex-col gap-2 bg-tertiary-dark rounded-lg p-3">
      {activeNote && (
        <div className="flex flex-col h-full justify-between">
          <input
            className={`text-2xl w-full font-bold ${
              (!activeNote.title || title !== activeNote.title) && "opacity-60"
            } bg-transparent outline-none`}
            name="title"
            value={title}
            placeholder="Untitled"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() =>
              activeNote.title !== title &&
              setActiveNote({ ...activeNote, title: title })
            }
          />
        </div>
      )}
    </div>
  );
};

export default function DetailsPlugin() {
  const { activeNote, setActiveNote } = useContext(NoteContext);

  return (
    <div className="flex w-full h-32 gap-2 px-2">
      <DetailsView activeNote={activeNote} setActiveNote={setActiveNote} />
    </div>
  );
}
