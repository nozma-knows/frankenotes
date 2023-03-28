import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { OpenAI } from "langchain/llms";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

type ResponseError = {
  message: string;
};

type ResponseData = {
  successful: boolean;
  error: ResponseError | null;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    message: string;
  };
}

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Grab prompt from request body
  const message = req.body.message;

  // If prompt is missing or empty string, return error
  if (!message || message === "") {
    res.status(400).json({
      successful: false,
      error: {
        message: "No prompt given",
      },
    });
  }

  const url = "https://slack.com/api/chat.postMessage";

  try {
    const result = await axios.post(
      url,
      {
        channel: "user-feedback",
        text: message,
      },
      {
        headers: {
          authorization: `Bearer ${process.env.NEXT_PUBLIC_SLACK_BOT_TOKEN}`,
        },
      }
    );
    console.log("result: ", result);
    res.status(200).json({
      successful: true,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      successful: false,
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
