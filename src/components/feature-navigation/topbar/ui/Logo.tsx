import Link from "next/link";

export default function Logo({ text }: { text: string }) {
  return (
    <Link href={"/"} className="text-2xl lg:text-3xl font-bold button">
      {text}
    </Link>
  );
}
