import Page from "@/components/ui/pages/Page";

export default function Home() {
  console.log(
    "process.env.NEXT_PUBLIC_BACKEND_URI: ",
    `${process.env.NEXT_PUBLIC_BACKEND_URI}/api`
  );
  return (
    <Page>
      <div>Frankenotes</div>
    </Page>
  );
}
