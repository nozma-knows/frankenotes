// import { NextApiRequest, NextApiResponse } from "next";

// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { PineconeStore } from "langchain/vectorstores";
// import { OpenAIEmbeddings } from "langchain/embeddings";
// import { PineconeClient } from "@pinecone-database/pinecone";
// import { Document } from "langchain/document";

// type ResponseError = {
//   message: string;
// };

// type ResponseData = {
//   message: string | null;
//   error: ResponseError | null;
// };

// interface GenerateNextApiRequest extends NextApiRequest {
//   body: {
//     notes: { contents: string }[];
//   };
// }

// export default async function handler(
//   req: GenerateNextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   try {
//     // const pinecone = new PineconeClient();
//     // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
//     console.log("env vars: ", {
//       PINECONE_API_KEY: process.env.PINECONE_API_KEY,
//       PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
//       PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
//       PINECONE_INDEX_URL: process.env.PINECONE_INDEX_URL,
//     });
//     const client = new PineconeClient();
// await client.init({
//   apiKey: process.env.PINECONE_API_KEY as string,
//   environment: process.env.PINECONE_ENVIRONMENT as string,
// });
//     const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);

//     console.log("pineconeIndex: ", pineconeIndex);

//     const docs = [
//       new Document({
//         // metadata: { foo: "bar" },
//         pageContent: "pinecone is a vector db",
//       }),
//       new Document({
//         // metadata: { foo: "bar" },
//         pageContent: "the quick brown fox jumped over the lazy dog",
//       }),
//       new Document({
//         // metadata: { baz: "qux" },
//         pageContent: "lorem ipsum dolor sit amet",
//       }),
//       new Document({
//         // metadata: { baz: "qux" },
//         pageContent: "pinecones are the woody fruiting body and of a pine tree",
//       }),
//     ];
//     console.log("docs: ", docs);
//     await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//       pineconeIndex,
//     });
//     res
//       .status(200)
//       .json({ message: "Successfully indexed vector store", error: null });
//   } catch (error) {
//     res.status(500).json({
//       message: null,
//       error: {
//         message: `Failed to add data to vector store - ${error}`,
//       },
//     });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { PineconeClient } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
// import { PineconeStore } from "langchain/vectorstores";

import { PineconeStore } from "langchain/vectorstores";
import { Document } from "langchain/document";

type ResponseError = {
  message: string;
};

type ResponseData = {
  message: string | null;
  error: ResponseError | null;
};

// interface GenerateNextApiRequest extends NextApiRequest {
//   body: {
//     notes: { content: string }[];
//     authorId: string;
//   };
// }

// export default async function handler(
//   req: GenerateNextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   try {
//     // Grab input args
//     const { notes, authorId } = req.body;

//     // Error handling on input args
//     if (!notes || !authorId) {
//       res.status(400).json({
//         message: null,
//         error: {
//           message: "No notes provided.",
//         },
//       });
//     }

//     // const indexesList = await pinecone.listIndexes();
//     // console.log("existingIndexes: ", indexesList);
//     // if (!indexesList.includes(process.env.PINECONE_INDEX_NAME as string)) {
//     //   console.log("index does not exist");
//     //   await pinecone.createIndex({
//     //     createRequest: {
//     //       name: "notes-index",
//     //       dimension: 1024,
//     //     },
//     //   });
//     // }

//     console.log("index-vector-store.tsx - notes: ", notes);

//     const splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 20,
//     });

//     const docs = notes.map((note: { content: string }) => {
//       return note.content;
//     });

//     const loadDocs = async () => {
//       return await splitter.createDocuments(docs);
//     };

//     const storeDocs = async () => {
//       const docs = await loadDocs();
//       const embeddings = new OpenAIEmbeddings();
//       const pinecone = new PineconeClient();
//       await pinecone.init({
//         apiKey: process.env.PINECONE_API_KEY as string,
//         environment: process.env.PINECONE_ENVIRONMENT as string,
//       });
//       const indexesList = await pinecone.listIndexes();
//       if (!indexesList.includes(process.env.PINECONE_INDEX_NAME as string)) {
//         console.log("index does not exist");
//         await pinecone.createIndex({
//           createRequest: {
//             name: "notes-index",
//             dimension: 1536,
//           },
//         });
//       }
//       const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);
//       // await PineconeStore.fromDocuments(docs, embeddings, {
//       //   pineconeIndex: index,
//       // });
//       // const indexStats = await index.describeIndexStats({
//       //   describeIndexStatsRequest: {},
//       // });
//       // console.log("indexStats: ", indexStats);
//       const texts = docs.map(({ pageContent }) => pageContent);
//       const embeddedDocs = await embeddings.embedDocuments(texts);
//       console.log("embeddedDocs: ", embeddedDocs);
//       const vectors = embeddedDocs.map((doc, index) => {
//         return {
//           id: `vec${index + 1}`,
//           values: doc,
//         };
//       });
//       const upsertRequest = {
//         vectors,
//         namespace: authorId,
//       };
//       await index
//         .upsert({ upsertRequest })
//         .then((response) => {
//           console.log("index.upsert - response: ", response);
//         })
//         .catch((err) => console.log("index.upsert - error: ", err));
//       await index.upsert({
//         upsertRequest,
//       });

//       // await index.upsert({
//       //   vectors: [
//       //     {
//       //       id: "1",
//       //       values: [1, 2, 3],
//       //       metadata: { size: 3, tags: ["a", "b", "c"] },
//       //     },
//       //     { id: "2", values: [4, 5, 6], metadata: { size: 10, tags: null } },
//       //   ],
//       // });
//     };
//     storeDocs()
//       .then(() => console.log("Successfully added docs to vector store."))
//       .catch((err) => console.log("storeDocs error: ", err));

//     const queryDocs = async () => {
//       const pinecone = new PineconeClient();
//       await pinecone.init({
//         apiKey: process.env.PINECONE_API_KEY as string,
//         environment: process.env.PINECONE_ENVIRONMENT as string,
//       });
//       const index = pinecone.Index(process.env.NODE_ENV);
//     };

//     // const pinecone = new PineconeClient();
//     // await pinecone.init({
//     //   apiKey: process.env.PINECONE_API_KEY as string,
//     //   environment: process.env.PINECONE_ENVIRONMENT as string,
//     // });
//     // const indexesList = await pinecone.listIndexes();
//     // console.log("existingIndexes: ", indexesList);
//     // if (!indexesList.includes(process.env.PINECONE_INDEX_NAME as string)) {
//     //   console.log("index does not exist");
//     //   await pinecone.createIndex({
//     //     createRequest: {
//     //       name: "notes-index",
//     //       dimension: 1024,
//     //     },
//     //   });
//     // }
//     // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);
//     // const indexStats = await index.describeIndexStats({
//     //   describeIndexStatsRequest: {},
//     // });
//     // console.log("indexStats: ", indexStats);
//     // const queryResponse = await index.query({
//     //   queryRequest: {
//     //     topK: 10,
//     //     vector: [0.1, 0.2, 0.3, 0.4],
//     //   },
//     // });
//     // console.log("queryResponse: ", queryResponse);
//     res.status(200).json({
//       message: "Successfully indexed vector store",
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

    const loadDocs = async () => {
      return await splitter.createDocuments([doc]);
    };

    const storeDocs = async () => {
      const docs = await loadDocs();
      console.log("docs: ", docs);
      console.log("docId: ", docId);
      console.log("authorId: ", authorId);
      const embeddings = new OpenAIEmbeddings();
      const pinecone = new PineconeClient();
      await pinecone.init({
        apiKey: process.env.PINECONE_API_KEY as string,
        environment: process.env.PINECONE_ENVIRONMENT as string,
      });

      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);
      const texts = docs.map(({ pageContent }) => pageContent);
      console.log("texts: ", texts);
      const embeddedDocs = await embeddings.embedDocuments(texts);
      const vectors = embeddedDocs.map((doc, index) => {
        return {
          id: `${docId}-vector-${index + 1}`,
          values: doc,
        };
      });
      console.log("vectors: ", vectors);
      const upsertRequest = {
        vectors,
        // namespace: authorId,
      };
      await index
        .upsert({ upsertRequest })
        .then((response) => {
          console.log("index.upsert - response: ", response);
        })
        .catch((err) => console.log("index.upsert - error: ", err));
      await index.upsert({
        upsertRequest,
      });
    };

    storeDocs()
      .then(() => console.log("Successfully added docs to vector store."))
      .catch((error) => {
        res.status(500).json({
          message: null,
          error: {
            message: `Failed to add data to vector store - ${error}`,
          },
        });
      });

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
