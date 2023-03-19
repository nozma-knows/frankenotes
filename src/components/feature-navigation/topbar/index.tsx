import { Logo, Tabs, LogoutButton } from "./ui";

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

export default function Topbar() {
  return (
    <div className="flex h-28 justify-between items-center px-2 sm:px-8">
      <Logo text={title} />
      <div className="flex gap-4">
        <Tabs tabs={tabs} />
        <LogoutButton />
      </div>
    </div>
  );
}
