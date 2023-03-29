import Link from "next/link";
import Logo from "@/components/ui/icons/Logo";
import FrankenotesLogo from "@/icons/logo.svg";

const title = `Frankenotes`;

export default function Topbar() {
  return (
    <div className="relative flex w-full items-center justify-center pt-12 px-8 h-20 text-main-dark">
      <Link href="/" className="flex items-center gap-2">
        <Logo Icon={FrankenotesLogo} text={title} />
      </Link>
    </div>
  );
}
