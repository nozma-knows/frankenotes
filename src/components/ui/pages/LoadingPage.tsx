import PulseLoader from "react-spinners/PulseLoader";
import Page from "./Page";

export default function LoadingPage() {
  return (
    <Page>
      <div className="flex justify-center items-center w-full h-full">
        <PulseLoader color="#58335e" size={40} />
      </div>
    </Page>
  );
}
