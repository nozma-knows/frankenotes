import Page from "@/components/ui/pages/Page";

export default function Home() {
  console.log(
    "process.env.NEXT_PUBLIC_BACKEND_URI: ",
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/api`
  );
  return (
    // <div className="flex w-screen h-screen items-center justify-center">
    //   <div className="text-4xl font-bold">Frankenotes</div>
    // </div>

    <Page>
      <div>Frankenotes</div>
    </Page>
  );
}
