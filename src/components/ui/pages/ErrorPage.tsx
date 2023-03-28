import Link from "next/link";
import Page from "./Page";

const buttonLabel = `Back to homepage`;

export default function ErrorPage() {
  return (
    <Page>
      <div className="flex flex-col justify-center items-center w-full h-full gap-4">
        <h1>Oh no! You have encountered an error</h1>
        <Link href="/" className="flex button p-4 rounded-xl button-primary">
          {buttonLabel}
        </Link>
      </div>
    </Page>
  );
}
