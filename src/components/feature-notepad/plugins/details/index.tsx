import { useContext } from "react";
import NoteContext from "../../context/useNoteContext";
import FilesView from "./FilesView";
import DetailsView from "./DetailsView";
import ControlsView from "./ControlsView";

export default function DetailsPlugin() {
  const { fileManagerOpen } = useContext(NoteContext);

  return (
    <div className="flex w-full h-32 gap-2">
      {!fileManagerOpen && <FilesView />}
      <DetailsView />
      <ControlsView />
    </div>
  );
}
