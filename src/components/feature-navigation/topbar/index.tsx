import { useState, useEffect } from "react";
import { Logo, Tabs, LogoutButton, Dropdown } from "./ui";
import useWindowSize, {
  ScreenOptions,
} from "@/components/utils/hooks/useWindowSize";

const title = "Frankenotes";

const tabs = [
  {
    label: "About",
    link: "/about",
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
  const size = useWindowSize();

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (size.screen === (ScreenOptions.MOBILE || ScreenOptions.SM)) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [showDropdown, size]);

  return (
    <div className="flex h-28 justify-between items-center px-2 sm:px-8">
      <Logo text={title} />
      <div className="flex gap-4">
        {showDropdown ? <Dropdown tabs={tabs} /> : <Tabs tabs={tabs} />}

        {/* <LogoutButton /> */}
      </div>
    </div>
  );
}
