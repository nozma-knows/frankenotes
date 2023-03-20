import { FaAngleRight } from "react-icons/fa";

export default function ClosedView({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <div className="flex border-2 rounded-xl">
        <FaAngleRight
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>
    </div>
  );
}
