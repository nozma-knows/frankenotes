import { Tooltip } from "@mui/material";
import { BsFillChatRightFill } from "react-icons/bs";

interface FeedbackButtonProps {
  disabled: boolean;
  setShowFeedbackPopup: (showFeedbackPopup: boolean) => void;
}

export default function FeedbackButton({
  disabled,
  setShowFeedbackPopup,
}: FeedbackButtonProps) {
  return (
    <div className="absolute bottom-4 right-4">
      <Tooltip title="Share feedback!" arrow>
        <button
          disabled={disabled}
          onClick={() => setShowFeedbackPopup(true)}
          type="button"
          aria-label="Share feedback!"
          className={`${!disabled && "button"} bg-tertiary-dark p-2 rounded-lg`}
        >
          <BsFillChatRightFill className="p-2 w-12 h-12" />
        </button>
      </Tooltip>
    </div>
  );
}
