import { MouseEventHandler } from "react";
import { Tooltip } from "@mui/material";
import { IconType } from "react-icons";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { BsPlusLg, BsChevronLeft, BsChevronDown } from "react-icons/bs";
import { smScreenMax } from "@/components/utils/hooks/useWindowSize";

const FileManagerTopbarButton = ({
  Icon,
  onClick,
  label,
  disabled = false,
  disabledMessage,
}: {
  Icon: IconType;
  onClick: MouseEventHandler<SVGElement>;
  label: string;
  disabled?: boolean;
  disabledMessage?: string;
}) => {
  return (
    <div
      className={
        disabled ? `cursor-not-allowed	opacity-50 text-lg` : `button text-lg`
      }
    >
      <Tooltip title={disabled ? `${label} - ${disabledMessage}` : label} arrow>
        <div>
          <Icon className="text-lg" onClick={!disabled ? onClick : undefined} />
        </div>
      </Tooltip>
    </div>
  );
};

const FileManagerTopbar = ({
  size,
  authorId,
  notes,
  CreateNote,
  setFileManagerOpen,
}: {
  size: { width: number; height: number };
  authorId: string;
  notes: Note[];
  CreateNote: any;
  setFileManagerOpen: (fileManagerOpen: boolean) => void;
}) => {
  const createNewNote = () => {
    CreateNote();
  };

  return (
    <div className="flex w-full p-2 rounded-t-xl">
      <div className="flex gap-1 sm:gap-4 items-center justify-end w-full">
        <div className="flex w-full gap-1 justify-between items-center text-main-dark">
          <div className="flex gap-1 sm:gap-4">
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              <FileManagerTopbarButton
                Icon={BsPlusLg}
                onClick={() => createNewNote()}
                label="Create a new note"
              />
            </div>
            <div className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 bg-tertiary-dark rounded-md">
              {size.width >= smScreenMax ? (
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
};

export default function FileManager() {
  return (
    <div className="flex w-full h-full sm:order-first sm:max-w-[16rem] md:max-w-[21rem] bg-red-400 max-h-72 sm:max-h-none">
      <div className="flex flex-col w-full h-full bg-main-light rounded-xl overflow-hidden">
        <FileManagerTopbar
          size={size}
          authorId={authorId}
          notes={files}
          CreateNote={CreateNote}
          setFileManagerOpen={setFileManagerOpen}
        />
        <div className="flex flex-col overflow-auto">
          {files.map((file: Note, index: number) => {
            return (
              <FilePreview
                key={index}
                file={file}
                isActive={activeNote ? activeNote.id === file.id : false}
                setActiveFile={setActiveNote}
                DeleteNote={DeleteNote}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
