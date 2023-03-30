import React, { useState, useEffect } from "react";
import { Context } from "@apollo/client";
import { parse } from "cookie";
import { Note } from "@/__generated__/graphql";
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
import { useQueryNotesAndNotesQueries } from "@/components/graph/queries/hooks/useQueryNotesAndNotesQueries";

// Redirect to homepage if not signed in
export async function getServerSideProps(context: Context) {
  const { token } = parse(context.req.headers.cookie);
  if (token) {
    return { props: { token } };
  }
  return { redirect: { destination: "/" } };
}

export default function Notepad({ token }: { token: string }) {
  // Page variables
  const decodedToken = DecodeToken({ token });
  const windowSize = useWindowSize();
  const [size, setSize] = useState("lg");

  // Notepad variables
  const authorId = decodedToken?.userId;
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(true);

  // Update size value when windowSize is updated
  // NOTE - This is a subpar solution, need to fix eventually
  useEffect(() => {
    const { width } = windowSize;
    if (width >= xlScreenMin) {
      setSize("xl");
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

  // grab Notes and NoteQueries from db
  const [
    loading,
    error,
    notesData,
    refetchNotes,
    notesQueriesData,
    refetchNotesQueries,
  ] = useQueryNotesAndNotesQueries(authorId!);

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
