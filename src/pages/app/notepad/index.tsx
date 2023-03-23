import React, { useState, useEffect } from "react";
import { useQuery, Context } from "@apollo/client";
import { parse } from "cookie";
import { Note } from "@/__generated__/graphql";
import { NotesQuery } from "@/components/graph";
import Page from "@/components/ui/pages/Page";
import Editor from "@/components/feature-notepad/Editor";
import DecodeToken from "@/components/utils/conversion/DecodeToken";
import FileManager from "@/components/feature-notepad/file-manager";
import useWindowSize, {
  smScreenMax,
} from "@/components/utils/hooks/useWindowSize";
import Logo from "@/components/ui/icons/Logo";
import FrankenotesLogo from "@/icons/logo.svg";

const title = `Frankenotes`;

export async function getServerSideProps(context: Context) {
  const { token } = parse(context.req.headers.cookie);
  if (token) {
    return { props: { token } };
  }
  return { redirect: { destination: "/" } };
}

const AppLogo = ({ size }: { size: { width: number; height: number } }) => {
  return (
    <div className="flex justify-center p-2 pb-4">
      {size.width >= smScreenMax && (
        <Logo Icon={FrankenotesLogo} text={title} />
      )}
    </div>
  );
};

export default function Notepad({ token }: { token: string }) {
  const decodedToken = DecodeToken({ token });
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const authorId = decodedToken?.userId;
  const [fileManagerOpen, setFileManagerOpen] = useState(true);

  const size = useWindowSize();

  // Grab users notes
  const { loading, error, data, refetch } = useQuery(NotesQuery, {
    variables: { authorId },
  });

  // const handleQueryVectorStore = async ({ query }: { query: string }) => {
  //   try {
  //     const response = await fetch(`../api/query-vector-store`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         query,
  //       }),
  //     });
  //     console.log("response: ", response);
  //   } catch (error) {
  //     console.error("Error submitting prompt: ", error);
  //   }
  // };

  // const handleIndexVectorStore = async ({
  //   // docId,
  //   doc,
  // }: {
  //   // docId: string;
  //   doc: string;
  // }) => {
  //   try {
  //     const response = await fetch(`../api/index-vector-store`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         // docId,
  //         doc,
  //         // authorId,
  //       }),
  //     });
  //   } catch (error) {
  //     console.error("Error submitting prompt: ", error);
  //   }
  // };

  if (loading) {
    return <div>Loading Page...</div>;
  }

  if (error) {
    return <div>Error Page...</div>;
  }
  if (data && authorId) {
    // handleIndexVectorStore({ doc: "My name is Noah, and I love to code." });
    // handleQueryVectorStore({ query: "Tell me something Noah likes." });
    return (
      <Page hideTopbar>
        <div className="flex flex-col sm:flex-row gap-2 p-2 w-full">
          {fileManagerOpen && (
            <div className="flex w-full h-1/3 sm:h-full order-last sm:order-none sm:max-w-[15rem] md:max-w-xs 2xl:max-w-sm">
              <div className="flex w-full flex-col">
                {size.width >= smScreenMax && <AppLogo size={size} />}
                <FileManager
                  files={data.notes}
                  authorId={authorId}
                  activeNote={activeNote}
                  setActiveNote={setActiveNote}
                  refetch={refetch}
                  setFileManagerOpen={setFileManagerOpen}
                />
              </div>
            </div>
          )}
          <div className="flex flex-1">
            <Editor
              activeFile={activeNote}
              setActiveFile={setActiveNote}
              authorId={authorId}
              refetch={refetch}
              fileManagerOpen={fileManagerOpen}
              setFileManagerOpen={setFileManagerOpen}
            />
          </div>
        </div>
      </Page>
    );
  }
}
