import React, { useState, useEffect, MouseEventHandler } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreateNotesQueryMutation,
  UpdateNotesQueryMutation,
  NotesQueriesQuery,
} from "@/components/graph";
import { Note, NotesQuery } from "@/__generated__/graphql";
// import TextField from "@/components/ui/form-fields/TextField";
import NoStyleTextfield from "@/components/ui/form-fields/NoStyleTextField";
import Button from "@/components/ui/buttons/Button";
import Popup from "@/components/ui/popups/Popup";
import MessageContainer from "../MessageContainer";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import { BsFillSendFill } from "react-icons/bs";

interface QueryNotesPopupProps {
  notes: Note[] | undefined;
  authorId: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
}

type MessageType = {
  message: string;
  sender: string;
};

const addUserMessage = ({
  query,
  CreateNotesQuery,
  // messages,
  // setMessages,
  setValue,
}: {
  query: string;
  CreateNotesQuery: (query: string) => void;
  setValue: any;
}) => {
  console.log("QUERY: ", query);
  CreateNotesQuery(query);
  setValue("query", "");
};

// const handleQueryNotes = async ({
//   notes,
// notesQuery,
// UpdateNotesQuery,
// }: // messages,
// // setMessages,
// {
//   notes: Note[] | undefined;
//   notesQuery: NotesQuery;
//   UpdateNotesQuery: (notesQuery: NotesQuery, response: string) => void;
//   // messages: { message: string; sender: string }[];
//   // setMessages: (messages: { message: string; sender: string }[]) => void;
// }) => {
//   try {
//     const content = notes
//       ? notes.map((note) => {
//           return {
//             contents: note.content,
//           };
//         })
//       : [];
//     const response = await fetch(`../api/query-notes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         notes: content,
//         query: notesQuery.query,
//       }),
//     });
//     const data = await response.json();
//     UpdateNotesQuery(notesQuery, data.message);
//   } catch (error) {
//     console.error("Error submitting prompt: ", error);
//   }
// };

const handleQueryVectorStore = async ({
  authorId,
  query,
  notesQuery,
  UpdateNotesQuery,
}: {
  authorId: string;
  query: string;
  notesQuery: NotesQuery;
  UpdateNotesQuery: (notesQuery: NotesQuery, response: string) => void;
}) => {
  try {
    console.log("QueryNotesPopup - handleQueryVectorStore - props: ", {
      authorId,
      query,
      notesQuery,
      UpdateNotesQuery,
    });
    const response = await fetch(`../api/query-vector-store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        authorId,
      }),
    });
    const data = await response.json();
    console.log("data: ", data);
    UpdateNotesQuery(notesQuery, data.message);
  } catch (error) {
    console.error("Error submitting prompt: ", error);
  }
};

export default function QueryNotesPopup({
  notes,
  authorId,
  onClose,
}: QueryNotesPopupProps) {
  const screenSize = useWindowSize();
  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  // useMutaiton call for updating a notesQuery
  const [
    updateNotesQuery,
    { loading: loadingUpdateNotesQuery, error: errorUpdateingNotesQuery },
  ] = useMutation(UpdateNotesQueryMutation, {
    onCompleted: () => {
      refetchNotesQueries();
    },
    onError: () => console.log("error!"),
  });

  const UpdateNotesQuery = (notesQuery: NotesQuery, response: string) => {
    const { id } = notesQuery;
    updateNotesQuery({
      variables: {
        id,
        input: {
          response,
        },
      },
    });
  };

  // useMutaiton call for creating a notesQuery
  const [createNotesQuery, { loading: loadingNote, error: errorGrabbingNote }] =
    useMutation(CreateNotesQueryMutation, {
      onCompleted: (data: { createNotesQuery: NotesQuery }) => {
        refetchNotesQueries();
        handleQueryVectorStore({
          authorId,
          query: data.createNotesQuery.query,
          notesQuery: data.createNotesQuery,
          UpdateNotesQuery,
        });
      },
      onError: () => console.log("error!"),
    });

  const CreateNotesQuery = (query: string) => {
    const input = {
      authorId,
      query,
    };
    createNotesQuery({
      variables: {
        input,
      },
    });
  };

  // React Hook Form variables
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      query: "",
    },
  });
  // Grab users notes queries
  const {
    loading: notesQueriesLoading,
    error: notesQueriesError,
    data,
    refetch: refetchNotesQueries,
  } = useQuery(NotesQueriesQuery, {
    variables: { authorId },
  });

  if (notesQueriesLoading) {
    return <div>Loading Page...</div>;
  }

  if (notesQueriesError) {
    return <div>Error Page...</div>;
  }

  if (data.notesQueries && authorId) {
    const messages = data.notesQueries.map((notesQuery: NotesQuery) => {
      return {
        query: notesQuery.query,
        response: notesQuery.response,
        status: notesQuery.status,
      };
    });
    return (
      <Popup
        style={{
          backgroundColor: "#061515",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "12px",
          padding: "1rem",
          width: screenSize.width > 1024 ? "65%" : "90%",
          height: `100%`,
        }}
        onClose={onClose}
      >
        <div className="flex flex-col w-full h-full rounded-lg p-4 gap-4 bg-main-light">
          <div className="flex w-full justify-center p-4">
            <div className="text-4xl font-bold">Ask your notes a question!</div>
          </div>
          <div className="flex w-full h-full bg-main-dark text-main-dark rounded-lg p-8 overflow-auto">
            <MessageContainer messages={messages} loading={loading} />
          </div>
          <div className="flex w-full items-center h-24 bg-main-dark text-main-dark rounded-lg">
            <form
              className="flex w-full h-full"
              onSubmit={handleSubmit(({ query }) =>
                addUserMessage({
                  query,
                  CreateNotesQuery,
                  setValue,
                })
              )}
            >
              <div className="flex w-full px-4">
                <div className="flex w-full gap-4">
                  <div className="flex w-full h-full items-center">
                    <NoStyleTextfield
                      control={control}
                      name="query"
                      type="text"
                      placeholder="What would you like to ask next?"
                      required="Query is required."
                      errors={errors}
                    />
                  </div>

                  <button>
                    <BsFillSendFill className="text-3xl button text-[#a56baf]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Popup>
    );
  }
  return null;
}
