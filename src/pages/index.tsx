import Page from "@/components/ui/pages/Page";

const title = `AI powered notebook.`;
// const subtitle = `Interact with your notes on a whole new level.`;
const subtitle = `Revolutionize the way you capture, access, and manage your thoughts.`;
// const subtitle = `The tool for interacting with `;

export default function Home() {
  return (
    <Page>
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="flex justify-center sm:justify-start w-full h-full p-4 sm:p-8 md:p-20">
          <div className="flex flex-col gap-4">
            <div className="text-3xl sm:text-4xl md:text-7xl font-bold">
              {title}
            </div>
            <div className="text-xl sm:text-2xl md:text-4xl">{subtitle}</div>
          </div>
        </div>
      </div>
    </Page>
  );
}
