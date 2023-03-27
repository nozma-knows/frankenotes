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

  if (loading) {
    return <div>Loading Page...</div>;
  }

  if (error) {
    return <div>Error Page...</div>;
  }
  if (data && authorId) {
    return (
      <Page hideTopbar>
        <div>Notepad</div>
      </Page>
    );
  }
}
