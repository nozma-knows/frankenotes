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

  const currentPath = `${router.pathname}`;
  return (
    <div className="flex gap-4">
      {tabs.map(({ label, link }) => {
        const onPath = link === currentPath; // True if tab corresponds to current path
        return (
          <Link
            className={`flex ${
              onPath && "text-[#a56baf]"
            } text-lg font-semibold button`}
            key={label}
            href={link}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
