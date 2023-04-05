import { NextApiRequest, NextApiResponse } from "next";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
// import { VectorDBQAChain } from "langchain/chains";
import { ChatVectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms";

type ResponseError = {
  message: string;
};

type ResponseData = {
  message: string | null;
  error: ResponseError | null;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    query: string;
    chatHistory: string;
    authorId: string;
  };
}

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Grab input args
    const { query, chatHistory, authorId } = req.body;
    // Error handling on input args
    if (!query || !authorId) {
      res.status(400).json({
        message: null,
        error: {
          message: "Missing input argument.",
        },
      });
    }

    const pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT as string,
    });

    const index = pinecone.Index(
      process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME as string
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex: index, namespace: authorId }
    );

    const model = new OpenAI({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });
    const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore, {
      k: 5,
      returnSourceDocuments: true,
    });

    const response = await chain.call({
      question: query,
      chat_history: chatHistory,
    });

    res.status(200).json({
      message: response.text,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: null,
      error: {
        message: `Failed to add data to vector store - ${error}`,
      },
    });
  }
}
