import { useQuery } from "@apollo/client";
import { NotesQuery, NotesQueriesQuery } from "@/components/graph";

// Function for grabbing notes and note queries from db
export const useQueryNotesAndNotesQueries = (authorId: string) => {
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
