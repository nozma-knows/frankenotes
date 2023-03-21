import { NextApiRequest, NextApiResponse } from "next";
// import { OpenAI } from "langchain";
import { ChatCompletionRequestMessage } from "openai";
import { OpenAIChat } from "langchain/llms";
import { CallbackManager } from "langchain/callbacks";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { loadQAMapReduceChain } from "langchain/chains";
import { loadQAStuffChain } from "langchain/chains";
type ResponseError = {
  message: string;
};

type ResponseData = {
  message: string | null;
  error: ResponseError | null;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    notes: { contents: string }[];
    pastQueries: any[];
    query: string;
  };
}
export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { notes, pastQueries, query } = req.body;
    // If notes are missing, return error
    if (!notes) {
      res.status(400).json({
        message: null,
        error: {
          message: "No notes given.",
        },
      });
    }

    // If query is missing, return error
    if (!query) {
      res.status(400).json({
        message: null,
        error: {
          message: "No query given.",
        },
      });
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 10,
    });

    const docsContent = notes.map((note: { contents: string }) => {
      return note.contents;
    });

    const docs = await splitter.createDocuments(docsContent);

    const callbackManager = CallbackManager.fromHandlers({
      handleLLMStart: async (llm: { name: string }, prompts: string[]) => {
        console.log(JSON.stringify(llm, null, 2));
        console.log(JSON.stringify(prompts, null, 2));
      },
      handleLLMEnd: async (output) => {
        console.log(JSON.stringify(output, null, 2));
      },
      handleLLMError: async (err: Error) => {
        console.error(err);
      },
    });

    const prefixMessages: ChatCompletionRequestMessage[] = pastQueries.map(
      (item) => {
        return {
          role: item.sender,
          content: item.message,
        };
      }
    );

    // const llm = new OpenAI();
    const llm = new OpenAIChat({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      concurrency: 10,
      prefixMessages,
      temperature: 1,
      verbose: true,
      callbackManager,
    });
    // const chain = loadQAMapReduceChain(llm);
    const chain = loadQAStuffChain(llm);

    const response = await chain.call({
      input_documents: docs,
      question: query,
    });
    res.status(200).json({
      message: response.text,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: null,
      error: {
        message: `An error occurred during your request: ${error}`,
      },
    });
  }
}
