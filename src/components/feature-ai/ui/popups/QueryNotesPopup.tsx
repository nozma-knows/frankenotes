import React, { useState, useContext, MouseEventHandler } from "react";
import NoteContext from "@/components/feature-notepad/context/useNoteContext";
import { FieldValues, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreateNotesQueryMutation,
  UpdateNotesQueryMutation,
  NotesQueriesQuery,
} from "@/components/graph";
import { Note, NotesQuery, NotesQueryStatus } from "@/__generated__/graphql";
import NoStyleTextfield from "@/components/ui/form-fields/NoStyleTextField";
import Popup from "@/components/ui/popups/Popup";
import MessageContainer from "../MessageContainer";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import { BsFillSendFill } from "react-icons/bs";
import PulseLoader from "react-spinners/PulseLoader";

interface QueryNotesPopupProps {
  notes: Note[] | undefined;
  authorId: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
}

const addUserMessage = ({
  query,
  CreateNotesQuery,
  setValue,
}: {
  query: string;
  CreateNotesQuery: (query: string) => void;
  setValue: any;
}) => {
  CreateNotesQuery(query);
  setValue("query", "");
};

const handleQueryVectorStore = async ({
  authorId,
  query,
  notesQuery,
  previousNotesQuery,
  UpdateNotesQuery,
}: {
  authorId: string;
  query: string;
  notesQuery: NotesQuery;
  previousNotesQuery: NotesQuery;
  UpdateNotesQuery: (
    notesQuery: NotesQuery,
    response: string,
    status: NotesQueryStatus
  ) => void;
}) => {
  const chatHistory = previousNotesQuery
    ? `Question: ${previousNotesQuery.query || ""}  Answer: ${
        previousNotesQuery.response || ""
      }`
    : "";

  try {
    const response = await fetch(`../api/query-vector-store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        chatHistory,
        authorId,
      }),
    });
    const data = await response.json();
    console.log("QueryNotesPopup.tsx - data: ", data);
    if (data.message) {
      UpdateNotesQuery(notesQuery, data.message, NotesQueryStatus.Successful);
    } else {
      UpdateNotesQuery(
        notesQuery,
        "There was an issue grabbing your response, please try again!",
        NotesQueryStatus.Error
      );
    }
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

  const { notesQueries, refetchNotesQueries } = useContext(NoteContext);

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

  const UpdateNotesQuery = (
    notesQuery: NotesQuery,
    response: string,
    status: NotesQueryStatus
  ) => {
    const { id } = notesQuery;
    updateNotesQuery({
      variables: {
        id,
        input: {
          response,
          status,
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
          previousNotesQuery: notesQueries[notesQueries.length - 1],
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

  if (notesQueries && authorId) {
    const messages = notesQueries.map((notesQuery: NotesQuery) => {
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
        <div className="flex flex-col w-full h-full rounded-lg p-2 sm:p-4 gap-2 sm:gap-4 bg-main-light">
          <div className="flex w-full justify-center p-1 sm:p-4">
            <div className="text-xl sm:text-4xl font-bold">
              Ask your notes a question!
            </div>
          </div>
          <div className="flex w-full h-full bg-main-dark text-main-dark rounded-lg p-2 sm:p-8 overflow-auto">
            <MessageContainer messages={messages} loading={loading} />
          </div>
          <div className="flex w-full items-center h-fit bg-main-dark text-main-dark rounded-lg">
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
              <div className="flex w-full pr-4">
                <div className="flex w-full gap-2 sm:gap-4">
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
                    <BsFillSendFill className="text-xl sm:text-3xl button text-[#a56baf]" />
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
