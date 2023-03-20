import Link from "next/link";

const title = `Frankenotes`;

export default function Topbar() {
  return (
    <div className="relative flex w-full items-center justify-center pt-12 px-8 h-20 text-main-dark">
      <Link href="/" className="flex items-center gap-2">
        <div className="text-2xl lg:text-3xl font-bold button">{title}</div>
      </Link>
    </div>
  );
}
