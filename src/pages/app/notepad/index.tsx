import React, { useState, useEffect } from "react";
import { useQuery, Context } from "@apollo/client";
import { parse } from "cookie";
import { Note } from "@/__generated__/graphql";
import { NotesQuery } from "@/components/graph";
import Page from "@/components/ui/pages/Page";
import DecodeToken from "@/components/utils/conversion/DecodeToken";
import useWindowSize, {
  smScreenMax,
} from "@/components/utils/hooks/useWindowSize";
import Logo from "@/components/ui/icons/Logo";
import FrankenotesLogo from "@/icons/logo.svg";
import Editor from "@/components/feature-notepad/Editor";

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

  // Grab notes from db
  const { loading, error, data, refetch } = useQuery(NotesQuery, {
    variables: { authorId },
  });

  // Loading view
  if (loading) {
    return <div>Loading Page...</div>;
  }

  // Error view
  if (error) {
    return <div>Error Page...</div>;
  }

  // Loaded view
  if (data && authorId) {
    console.log("data: ", data);
    console.log("authorId: ", authorId);
    return (
      <Page hideTopbar>
        <Editor />
      </Page>
    );
  }
}
