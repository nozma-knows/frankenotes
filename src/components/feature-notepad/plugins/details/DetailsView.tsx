import { useState, useEffect, useContext } from "react";
import NoteContext from "../../context/useNoteContext";

export default function DetailsView() {
  const { activeNote, setActiveNote } = useContext(NoteContext);

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
}
