import { useRouter } from "next/router";
import Link from "next/link";

type TabType = {
  label: string;
  link: string;
};

interface TabsProps {
  tabs: TabType[];
}

export default function Tabs({ tabs }: TabsProps) {
  const router = useRouter();

  const pathRoute = () => `/${router.pathname.split("/")[1]}`;

  return (
    <div className="flex gap-4">
      {tabs.map(({ label, link }) => (
        <Link
          className={`${
            link === pathRoute() && "text-[#a56baf]"
          } text-lg font-semibold button hidden md:flex`}
          key={label}
          href={link}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}