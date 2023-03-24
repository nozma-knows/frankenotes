import { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores";

type ResponseError = {
  message: string;
};

type ResponseData = {
  message: string | null;
  error: ResponseError | null;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    docId: string;
    doc: string;
    authorId: string;
  };
}

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Grab input args
    const { docId, doc, authorId } = req.body;

    // Error handling on input args
    if (!docId || !doc || !authorId) {
      res.status(400).json({
        message: null,
        error: {
          message: "Missing input argument.",
        },
      });
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 20,
    });

    const numberOfVectors = (await splitter.createDocuments([doc])).length;

    const pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT as string,
    });

    const pineconeIndex = pinecone.Index(
      process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME as string
    );

    const vectorIds = [];

    for (var i = 0; i < numberOfVectors; i += 1) {
      vectorIds.push(`${docId}-vector-${i + 1}`);
    }

    await pineconeIndex.delete1({
      ids: vectorIds,
      namespace: authorId,
    });

    res.status(200).json({
      message: "Successfully deleted vector from vector store",
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
