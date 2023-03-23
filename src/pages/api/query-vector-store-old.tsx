import { NextApiRequest, NextApiResponse } from "next";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
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
    authorId: string;
  };
}

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY as string,
      environment: process.env.PINECONE_ENVIRONMENT as string,
    });
    const pineconeIndex = client.Index(
      process.env.PINECONE_INDEX_NAME as string
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );
    const results = await vectorStore.similaritySearch("pizza");
    console.log("results: ", results);
    // const model = new OpenAI();
    // const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    //   returnSourceDocuments: true,
    // });
    // const response = await chain.call({
    //   query: "Give me a summary of the documents.",
    // });
    res.status(200).json({
      message: "Successfully grabbed data from vector store.",
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

// export default async function handler(
//   req: GenerateNextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   try {
//     // Grab input args
//     const { query, authorId } = req.body;

//     // Error handling on input args
//     if (!query || !authorId) {
//       res.status(400).json({
//         message: null,
//         error: {
//           message: "Missing input argument.",
//         },
//       });
//     }

//     const client = new PineconeClient();
//     await client.init({
//       apiKey: process.env.PINECONE_API_KEY as string,
//       environment: process.env.PINECONE_ENVIRONMENT as string,
//     });

//     console.log("query-vector-store.tsx - query: ", query);

//     const embeddings = new OpenAIEmbeddings();
//     const embeddedQuery = await embeddings.embedQuery(query);
//     // console.log("embeddedQuery: ", embeddedQuery);

//     const pinecone = new PineconeClient();
//     await pinecone.init({
//       apiKey: process.env.PINECONE_API_KEY as string,
//       environment: process.env.PINECONE_ENVIRONMENT as string,
//     });

//     const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);
//     console.log("INDEX: ", index);
//     const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//       pineconeIndex: index,
//       // namespace: authorId,
//     });
//     console.log("vectorStore: ", vectorStore);
//     const results = await vectorStore.similaritySearch(query, 1);
//     console.log("query-vector-store.tsx - results: ", results);

//     // const model = new OpenAI();
//     // const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
//     //   k: 1,
//     //   returnSourceDocuments: true,
//     // });

//     // const response = await chain.call({ query });
//     // console.log("response: ", response);
//     res.status(200).json({
//       // message: response.text,
//       message: "Success",
//       error: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: null,
//       error: {
//         message: `Failed to add data to vector store - ${error}`,
//       },
//     });
//   }
// }
