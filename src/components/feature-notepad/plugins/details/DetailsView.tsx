import { useState, useEffect, useContext } from "react";
import NoteContext from "../../context/useNoteContext";
import {
  FormatDateShort,
  FormatDateTimeLong,
} from "@/components/utils/conversion/FormatDate";

export default function DetailsView() {
  const { activeNote, setActiveNote, size } = useContext(NoteContext);

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
            onChange={(e) =>
              setActiveNote({ ...activeNote, title: e.target.value })
            }
            onBlur={() => setActiveNote({ ...activeNote, title: title })}
          />
          <div className="flex gap-2 text-xl text-main-dark">
            <div className="font-bold">
              <div>Created</div>
              <div>Updated</div>
            </div>
            <div>
              {["md", "lg", "xl"].includes(size) ? (
                <>
                  <div>
                    {FormatDateTimeLong({
                      date: new Date(Number(activeNote.createdAt)),
                    })}
                  </div>
                  <div>
                    {FormatDateTimeLong({
                      date: new Date(Number(activeNote.updatedAt)),
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {FormatDateShort({
                      date: new Date(Number(activeNote.createdAt)),
                    })}
                  </div>
                  <div>
                    {FormatDateShort({
                      date: new Date(Number(activeNote.updatedAt)),
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
