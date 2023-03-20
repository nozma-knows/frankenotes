import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms";
import { BufferWindowMemory } from "langchain/memory";

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
  };
}

// export default async function handler(
//   req: GenerateNextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   // try {
//   // Grab prompt from request body
//   const query = req.body.query;
//   console.log("query: ", query);

//   // If prompt is missing or empty string, return error
//   if (!query) {
//     res.status(400).json({
//       message: null,
//       error: {
//         message: "No query given",
//       },
//     });
//   }

//   const pinecone: any = new PineconeClient();

//   await pinecone.init({
//     environment: process.env.PINECONE_ENVIRONMENT as string,
//     apiKey: process.env.PINECONE_API_KEY as string,
//   });

//   // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);
//   const vectorStore = await PineconeStore.fromExistingIndex(
//     // index,
//     pinecone.Index(process.env.PINECONE_INDEX_NAME as string),
//     new OpenAIEmbeddings()
//   );
//   const model = new OpenAI();
//   const chain = VectorDBQAChain.fromLLM(model, vectorStore);
//   console.log("chain: ", chain);
//   return await chain.call({
//     query: "what does the doc say about pinecone",
//   });

//   // console.log("response: ", response);
// }

// export default async function handler(
//   req: GenerateNextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   try {
//     // Grab prompt from request body
//     const query = req.body.query;

//     // If prompt is missing or empty string, return error
//     if (!query) {
//       res.status(400).json({
//         message: null,
//         error: {
//           message: "No query given",
//         },
//       });
//     }
//     const searchDocs = async () => {
//       const pinecone: any = new PineconeClient();
//       await pinecone.init({
//         environment: process.env.PINECONE_ENVIRONMENT as string,
//         apiKey: process.env.PINECONE_API_KEY as string,
//       });

//       const index = pinecone.Index(process.env.PINECONE_INDEX_URL as string);
//       console.log("index: ", index);
//       const vectorStore = await PineconeStore.fromExistingIndex(
//         pinecone,
//         new OpenAIEmbeddings(),
//         pinecone.Index(process.env.PINECONE_INDEX_URL) as string
//       );
//       console.log("vectorStore: ", vectorStore.pineconeClient.fetch);
//       const memory = new BufferWindowMemory({ k: 20 });
//       const model = new OpenAI();
//       const chain = VectorDBQAChain.fromLLM(model, vectorStore);
//       chain.memory = memory;
//       return await chain.call({
//         query,
//       });
//     };

//     searchDocs()
//       .then((response) => {
//         console.log(
//           "Successfully added docs to vector store - response: ",
//           response
//         );
//         return res.status(200).json({
//           message: response.toString(),
//           error: null,
//         });
//       })
//       .catch((err) =>
//         res.status(501).json({
//           message: null,
//           error: {
//             message: `An error occurred during your request: ${err}`,
//           },
//         })
//       );
//   } catch (error) {
//     res.status(500).json({
//       message: null,
//       error: {
//         message: `An error occurred during your request: ${error}`,
//       },
//     });
//   }
// }

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Grab prompt from request body
    const query = req.body.query;

    // If prompt is missing or empty string, return error
    if (!query) {
      res.status(400).json({
        message: null,
        error: {
          message: "No query given",
        },
      });
    }
    const searchDocs = async () => {
      const pinecone: any = new PineconeClient();
      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT as string,
        apiKey: process.env.PINECONE_API_KEY as string,
      });

      const index = pinecone.Index(process.env.PINECONE_INDEX_URL as string);
      const vectorStore = await PineconeStore.fromExistingIndex(
        pinecone,
        new OpenAIEmbeddings(),
        pinecone.Index(process.env.PINECONE_INDEX_URL) as string
      );
      const memory = new BufferWindowMemory({ k: 20 });
      const model = new OpenAI();
      const chain = VectorDBQAChain.fromLLM(model, vectorStore);
      chain.memory = memory;
      return await chain.call({
        query,
      });
    };

    searchDocs()
      .then((response) => {
        console.log(
          "Successfully added docs to vector store - response: ",
          response
        );
        return res.status(200).json({
          message: response.toString(),
          error: null,
        });
      })
      .catch((err) =>
        res.status(501).json({
          message: null,
          error: {
            message: `An error occurred during your request: ${err}`,
          },
        })
      );
  } catch (error) {
    res.status(500).json({
      message: null,
      error: {
        message: `An error occurred during your request: ${error}`,
      },
    });
  }
}
