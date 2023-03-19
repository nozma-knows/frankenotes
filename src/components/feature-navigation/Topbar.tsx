import Link from "next/link";
import { useRouter } from "next/router";

const title = "Frankenotes";

const tabs = [
  {
    label: "About",
    link: "about",
  },
  {
    label: "Login",
    link: "/auth/login",
  },
  {
    label: "Sign up",
    link: "/auth/signup",
  },
];

const Logo = ({ text }: { text: string }) => {
  return <div className="text-2xl lg:text-3xl font-bold button">{text}</div>;
};

const Tabs = () => {
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
};

const LogoutButton = () => {
  return (
    <div>
      <div>Logout Button</div>
    </div>
  );
};

export default function Topbar() {
  return (
    <div className="flex h-28 justify-between items-center px-2 sm:px-8">
      <Logo text={title} />
      <div className="flex gap-4">
        <Tabs />
        <LogoutButton />
      </div>
    </div>
  );
}
