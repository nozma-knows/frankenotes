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

    console.log("doc: ", doc);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 20,
    });

    const loadDocs = async () => {
      return await splitter.createDocuments([doc]);
    };

    const docs = await loadDocs();
    console.log("docs: ", docs);

    const embeddings = new OpenAIEmbeddings();
    const pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY as string,
      environment: process.env.PINECONE_ENVIRONMENT as string,
    });

    // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);
    const pineconeIndex = pinecone.Index(
      process.env.PINECONE_INDEX_NAME as string
    );

    await PineconeStore.fromDocuments(docs, embeddings, { pineconeIndex });

    // const texts = docs.map(({ pageContent }) => pageContent);

    // const embeddedDocs = await embeddings.embedDocuments(texts);
    // const vectors = embeddedDocs.map((doc, index) => {
    //   return {
    //     id: `${docId}-vector-${index + 1}`,
    //     values: doc,
    //   };
    // });

    // const upsertRequest = {
    //   vectors,
    // };

    // await index
    //   .upsert({ upsertRequest })
    //   .then(async (response) => {
    //     console.log("index.upsert - response: ", response);
    //   })
    //   .catch((err) => console.log("index.upsert - error: ", err));

    res.status(200).json({
      message: "Successfully indexed vector store",
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
