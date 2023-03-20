// export default function AIPlugin() {
//   return (
//     <div className="h-20 border-2 border-t-0 rounded-b-xl">
//       <div>AI Plugin</div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { FieldValues, useForm, UseFormSetValue } from "react-hook-form";
import TextField from "@/components/ui/form-fields/TextField";
import Button from "@/components/ui/buttons/Button";
// import MessageContainer from "@/components/feature-chat-bot/ui/MessageContainer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";

const title = `Chat Bot`;

type DataType = {
  result: string;
  error: {
    message: string;
  };
};

type MessageType = {
  message: string;
  sender: string;
};

interface OnSubmitProps {
  prompt: any;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  setValue: UseFormSetValue<FieldValues>;
  setLoading: (loading: boolean) => void;
}

const addUserMessage = ({
  prompt,
  messages,
  setMessages,
  setValue,
}: {
  prompt: any;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  setValue: any;
}) => {
  setMessages([
    ...messages,
    {
      message: prompt,
      sender: "user",
    },
  ]);
  setValue("prompt", "");
};

const grabResponse = async ({
  prompt,
  messages,
  setMessages,
  setLoading,
}: {
  prompt: string;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  setLoading: (loading: boolean) => void;
}) => {
  try {
    const response = await fetch("../api/chat-bot-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    setMessages([
      ...messages,
      {
        message: data.result,
        sender: "bot",
      },
    ]);
    setLoading(false);
  } catch (error) {
    console.error("Error submitting prompt: ", error);
    setLoading(false);
  }
  setLoading(false);
};

const onSubmit = async ({
  prompt,
  messages,
  setMessages,
  setValue,
  setLoading,
}: OnSubmitProps) => {
  setLoading(true);
  addUserMessage({ prompt, messages, setMessages, setValue });
};

const AIForm = ({
  messages,
  setMessages,
  loading,
  setLoading,
}: {
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  // Variables

  // React Hook Form variables
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      prompt: "",
    },
  });

  return (
    <form
      className="flex w-full gap-4 items-center"
      onSubmit={handleSubmit(({ prompt }) =>
        onSubmit({ prompt, messages, setMessages, setValue, setLoading })
      )}
    >
      <TextField
        control={control}
        name="prompt"
        type="text"
        placeholder={`${messages.length ? "" : "Introduce yourself!"}`}
        required="Message is required."
        errors={errors}
      />
      <div className="pb-5">
        <Button label="Send" disabled={loading} className="flex py-2" />
      </div>
    </form>
  );
};

export default function AIPlugin() {
  const [editor] = useLexicalComposerContext();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === "user") {
      const prompt = messages[messages.length - 1].message;
      grabResponse({ prompt, messages, setMessages, setLoading });
    }
  }, [messages, setMessages]);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === "bot") {
      editor.update(() => {
        const root = $getRoot();
        const p = $createParagraphNode();
        p.append($createTextNode(messages[messages.length - 1].message));
        root.append(p);
      });
    }
  }, [editor, messages]);

  return (
    <div className="border-2 border-t-0 rounded-b-xl px-2 pt-2">
      <AIForm
        messages={messages}
        setMessages={setMessages}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}
