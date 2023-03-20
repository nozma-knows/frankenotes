import React, { useEffect, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";

type MessageType = {
  message: string;
  sender: string;
};

export default function MessageContainer({
  messages,
  loading,
}: {
  messages: MessageType[];
  loading: boolean;
}) {
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current?.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  return (
    <div
      className="flex flex-col w-full h-full border-2 p-4 rounded-xl gap-4 overflow-auto scroll-smooth"
      ref={scrollRef}
    >
      {messages.map((message, index) => {
        return (
          <div
            className={`flex w-full ${
              message.sender === "user" && "justify-end"
            }`}
            key={index}
          >
            <div
              className={`flex w-fit p-2 px-4 rounded-xl max-w-sm ${
                message.sender === "user"
                  ? " bg-blue-700"
                  : "bg-white text-main-light"
              }`}
            >
              {message.message}
            </div>
          </div>
        );
      })}
      {loading && (
        <div className="">
          <PulseLoader color="#58335e" size={8} />
        </div>
      )}
    </div>
  );
}
