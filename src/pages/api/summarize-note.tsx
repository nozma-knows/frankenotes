import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";

type ResponseError = {
  message: string;
};

type ResponseData = {
  message: string | null;
  error: ResponseError | null;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    note: string;
    query: string;
  };
}
export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { note } = req.body;
    console.log("notes, query: ", note);
    // If notes are missing, return error
    if (!note) {
      res.status(400).json({
        message: null,
        error: {
          message: "No note given.",
        },
      });
    }
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 10,
    });
    const docs = await splitter.createDocuments([note]);
    const llm = new OpenAI();
    const chain = loadSummarizationChain(llm);

    const response = await chain.call({
      input_documents: docs,
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
