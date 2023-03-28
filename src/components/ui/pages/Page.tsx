import { useState } from "react";
import { Tooltip } from "@mui/material";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import { BsFillChatRightFill } from "react-icons/bs";
import FeedbackPopup from "../popups/FeedbackPopup";
import dynamic from "next/dynamic";
const Topbar = dynamic(() => import("@/components/feature-navigation/topbar"), {
  ssr: false,
});

interface PageProps {
  hideTopbar?: boolean;
  children: JSX.Element;
}

const Feedback = ({
  disabled,
  setShowFeedbackPopup,
}: {
  disabled: boolean;
  setShowFeedbackPopup: (showFeedbackPopup: boolean) => void;
}) => {
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
};

export default function Page({ hideTopbar = false, children }: PageProps) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();

  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  return (
    <div
      className="flex flex-col bg-main-dark text-main-dark w-full min-w-0 relative"
      style={{ width: screenWidth, height: screenHeight }}
    >
      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}
      {!hideTopbar && <Topbar />}
      <div className="flex w-full h-full">{children}</div>
      <Feedback disabled={false} setShowFeedbackPopup={setShowFeedbackPopup} />
    </div>
  );
}
