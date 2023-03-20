import React, { useEffect, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { NotesQueryStatus } from "@/__generated__/graphql";

// type MessageType = {
//   message: string;
//   sender: string;
// };

type MessageType = {
  query: string;
  response: string;
  status: NotesQueryStatus;
};

export default function MessageContainer({
  messages,
  loading,
}: {
  messages: MessageType[];
  loading: boolean;
}) {
  const scrollRef = useRef<any>(null);
  const noMessagesMessage = `No messages to display yet, don't be shy!`;

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current?.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [scrollRef]);

  return (
    <div
      className="flex flex-col w-full h-full border-2 p-4 rounded-xl gap-4 overflow-auto scroll-smooth"
      ref={scrollRef}
    >
      {messages.length ? (
        <div>
          {messages.map((message, index) => {
            return (
              <div className="flex flex-col gap-4" key={index}>
                <div className="flex w-full justify-end">
                  <div className="flex w-fit p-2 px-4 rounded-xl max-w-sm bg-blue-700">
                    {message.query}
                  </div>
                </div>
                {message.response ? (
                  <div key={index} className="flex w-full justify-start">
                    <div className="flex w-fit p-2 px-4 rounded-xl max-w-sm bg-white text-main-light">
                      {message.response}
                    </div>
                  </div>
                ) : (
                  <PulseLoader
                    className="flex w-fit p-4"
                    color="#58335e"
                    size={8}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex w-full h-full justify-center items-center text-center text-2xl md:text-4xl font-bold p-2">
          {noMessagesMessage}
        </div>
      )}
    </div>
  );
}
