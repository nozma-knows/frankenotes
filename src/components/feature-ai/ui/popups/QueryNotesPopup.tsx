import React, { useState, useEffect, MouseEventHandler } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreateNotesQueryMutation,
  UpdateNotesQueryMutation,
  NotesQueriesQuery,
} from "@/components/graph";
import { Note, NotesQuery } from "@/__generated__/graphql";
import TextField from "@/components/ui/form-fields/TextField";
import Button from "@/components/ui/buttons/Button";
import Popup from "@/components/ui/popups/Popup";
import MessageContainer from "../MessageContainer";
import useWindowSize from "@/components/utils/hooks/useWindowSize";

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
  // messages: MessageType[];
  // setMessages: (messages: MessageType[]) => void;
  setValue: any;
}) => {
  CreateNotesQuery(query);
  // setMessages([
  //   ...messages,
  //   {
  //     message: query,
  //     sender: "user",
  //   },
  // ]);
  setValue("query", "");
};

const handleQueryNotes = async ({
  notes,
  notesQuery,
  UpdateNotesQuery,
}: // messages,
// setMessages,
{
  notes: Note[] | undefined;
  notesQuery: NotesQuery;
  UpdateNotesQuery: (notesQuery: NotesQuery, response: string) => void;
  // messages: { message: string; sender: string }[];
  // setMessages: (messages: { message: string; sender: string }[]) => void;
}) => {
  try {
    const content = notes
      ? notes.map((note) => {
          return {
            contents: note.content,
          };
        })
      : [];
    const response = await fetch(`../api/query-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: content,
        query: notesQuery.query,
      }),
    });
    const data = await response.json();
    UpdateNotesQuery(notesQuery, data.message);
    // setMessages([
    //   ...messages,
    //   {
    //     message: data.message,
    //     sender: "bot",
    //   },
    // ]);
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

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (messages.length && messages[messages.length - 1].sender === "user") {
  //     setLoading(true);
  //     const query = messages[messages.length - 1].message;
  //     handleQueryNotes({ notes, query, messages, setMessages });
  //   } else {
  //     setLoading(false);
  //   }
  // }, [messages, notes, setMessages]);

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
        handleQueryNotes({
          notes,
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
        title="Ask your notes a question!"
        style={{
          backgroundColor: "#061515",
          color: "#e3d1e6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "12px",
          padding: "2rem",
          width: screenSize.width > 1024 ? "65%" : "90%",
          height: `100%`,
        }}
        onClose={onClose}
      >
        <div className="flex w-full h-full justify-center items-center overflow-hidden">
          <form
            className="flex w-full h-full"
            onSubmit={handleSubmit(({ query }) =>
              addUserMessage({
                query,
                CreateNotesQuery,
                // messages,
                // setMessages,
                setValue,
              })
            )}
            // onSubmit={handleSubmit(CreateNotesQuery(query))}
          >
            <div className="flex flex-col w-full px-8 gap-8">
              <MessageContainer messages={messages} loading={loading} />
              <div className="flex items-center gap-2">
                <TextField
                  control={control}
                  name="query"
                  type="text"
                  placeholder={`${messages.length ? "" : "Ask a question!"}`}
                  required="Query is required."
                  errors={errors}
                />
                <div className="pb-5">
                  <Button
                    label="Send"
                    disabled={loading}
                    className="flex py-2"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </Popup>
    );
  }
  return null;
}
