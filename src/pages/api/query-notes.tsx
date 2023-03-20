import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
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
    query: string;
  };
}

// Initalize the wrapper
// const model = new OpenAI({
//   openAIApiKey: process.env.OPENAI_API_KEY,
//   temperature: 0.9,
// });

// const memory = new BufferMemory();
// const chain = new ConversationChain({ llm: model, memory: memory });

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { notes, query } = req.body;
    console.log("notes, query: ", { notes, query });
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

    const llm = new OpenAI();
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
