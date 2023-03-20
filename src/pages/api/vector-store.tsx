import { NextApiRequest, NextApiResponse } from "next";
import { Note } from "@/__generated__/graphql";
// import { JSONLoader } from "langchain/document_loaders";
// import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
// import { PineconeClient } from "pinecone-client";
import { PineconeClient } from "@pinecone-database/pinecone";

// import { OpenAI } from "langchain/llms";
// import { BufferMemory } from "langchain/memory";
// import { ConversationChain } from "langchain/chains";

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
    // Grab prompt from request body
    const notes = req.body.notes;

    // If prompt is missing or empty string, return error
    if (!notes) {
      res.status(400).json({
        message: null,
        error: {
          message: "No notes given",
        },
      });
    }

    console.log("vector-store.tsx - notes: ", notes);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 10,
    });

    const docs = notes.map((note: { contents: string }) => {
      return note.contents;
    });

    const loadDocs = async () => {
      return await splitter.createDocuments(docs);
    };

    const storeDocs = async () => {
      const docs = await loadDocs();
      const embeddings = new OpenAIEmbeddings();
      const pinecone: any = new PineconeClient();

      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT as string,
        apiKey: process.env.PINECONE_API_KEY as string,
      });

      const index = pinecone.Index(process.env.PINECONE_INDEX_URL as string);

      await PineconeStore.fromDocuments(pinecone, docs, embeddings, index);
    };

    storeDocs()
      .then(() => console.log("Successfully added docs to vector store."))
      .catch((err) => console.log(err));

    return res.status(200).json({
      message: "Successfully added docs to vector store!",
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
