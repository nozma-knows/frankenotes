import React, { useState, useEffect } from "react";
import { useQuery, Context } from "@apollo/client";
import { parse } from "cookie";
// import { Tooltip } from "@mui/material";
// import { BsFillChatRightFill } from "react-icons/bs";
import { Note } from "@/__generated__/graphql";
import { NotesQuery, NotesQueriesQuery } from "@/components/graph";
import Page from "@/components/ui/pages/Page";
import DecodeToken from "@/components/utils/conversion/DecodeToken";
import useWindowSize, {
  smScreenMax,
  mdScreenMax,
  lgScreenMax,
  xlScreenMin,
} from "@/components/utils/hooks/useWindowSize";
import Editor from "@/components/feature-notepad/Editor";
import NoteContext from "@/components/feature-notepad/context/useNoteContext";
import LoadingPage from "@/components/ui/pages/LoadingPage";
import ErrorPage from "@/components/ui/pages/ErrorPage";
import FeedbackPopup from "@/components/ui/popups/FeedbackPopup";

export async function getServerSideProps(context: Context) {
  const { token } = parse(context.req.headers.cookie);
  if (token) {
    return { props: { token } };
  }
  return { redirect: { destination: "/" } };
}

// const FeedbackButton = ({
//   disabled,
//   setShowFeedbackPopup,
// }: {
//   disabled: boolean;
//   setShowFeedbackPopup: (showFeedbackPopup: boolean) => void;
// }) => {
//   return (
//     <div className="absolute bottom-4 right-4">
//       <Tooltip title="Share feedback!" arrow>
//         <button
//           disabled={disabled}
//           onClick={() => setShowFeedbackPopup(true)}
//           type="button"
//           aria-label="Share feedback!"
//           className={`${!disabled && "button"} bg-tertiary-dark p-2 rounded-lg`}
//         >
//           <BsFillChatRightFill className="p-2 w-12 h-12" />
//         </button>
//       </Tooltip>
//     </div>
//   );
// };

export default function Notepad({ token }: { token: string }) {
  const decodedToken = DecodeToken({ token });
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const authorId = decodedToken?.userId;
  const [fileManagerOpen, setFileManagerOpen] = useState(true);

  const windowSize = useWindowSize();

  const [size, setSize] = useState("lg");

  useEffect(() => {
    const { width } = windowSize;
    if (width >= xlScreenMin) {
      setSize("xl");
      // setSize("lg");
    } else if (
      width >= lgScreenMax ||
      (width >= mdScreenMax && !fileManagerOpen)
    ) {
      setSize("lg");
    } else if (
      width >= mdScreenMax ||
      (width >= smScreenMax && !fileManagerOpen)
    ) {
      setSize("md");
    } else {
      setSize("sm");
    }
  }, [fileManagerOpen, size, windowSize]);

  // Function for grabbing notes and note queries from db
  const useQueryNotesAndNotesQueries = () => {
    const {
      loading: loadingNotes,
      error: errorLoadingNotes,
      data: notesData,
      refetch: refetchNotes,
    } = useQuery(NotesQuery, {
      variables: { authorId },
    });
    const {
      loading: loadingNotesQueries,
      error: errorLoadingNotesQueries,
      data: notesQueriesData,
      refetch: refetchNotesQueries,
    } = useQuery(NotesQueriesQuery, {
      variables: { authorId },
    });
    const loading = loadingNotes || loadingNotesQueries;
    const error = errorLoadingNotes || errorLoadingNotesQueries;
    return [
      loading,
      error,
      notesData,
      refetchNotes,
      notesQueriesData,
      refetchNotesQueries,
    ];
  };

  // // Grab notes from db
  // const { loading, error, data, refetch } = useQuery(NotesQuery, {
  //   variables: { authorId },
  // });

  // grabnotes and note queries from db
  const [
    loading,
    error,
    notesData,
    refetchNotes,
    notesQueriesData,
    refetchNotesQueries,
  ] = useQueryNotesAndNotesQueries();

  // Loading view
  if (loading) {
    return <LoadingPage />;
  }

  // Error view
  if (error) {
    return <ErrorPage />;
  }

  // Loaded view
  if (notesData && notesQueriesData && authorId) {
    return (
      <NoteContext.Provider
        value={{
          authorId,
          size,
          activeNote,
          setActiveNote,
          notes: notesData.notes,
          loadingNotes: loading,
          errorGrabbingNotes: error,
          refetchNotes,
          notesQueries: notesQueriesData.notesQueries,
          refetchNotesQueries,
          fileManagerOpen,
          setFileManagerOpen,
          showFeedbackPopup,
          setShowFeedbackPopup,
        }}
      >
        <Page hideTopbar>
          <>
            {showFeedbackPopup && (
              <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
            )}
            <Editor />
          </>
        </Page>
      </NoteContext.Provider>
    );
  }
}
