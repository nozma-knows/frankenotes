import { useState, useEffect } from "react";
import Image from "next/image";
import FrankenotesLogo from "@/icons/logo.svg";
import { useCookies } from "react-cookie";
import { Tabs, LogoutButton, Dropdown } from "./ui";
import Logo from "@/components/ui/icons/Logo";
import useWindowSize, {
  ScreenOptions,
} from "@/components/utils/hooks/useWindowSize";

const title = "Frankenotes";

const tabs = (token?: string) => {
  if (token) {
    return [
      {
        label: "Notepad",
        link: "/app/notepad",
      },
    ];
  }
  return [
    // {
    //   label: "About",
    //   link: "/about",
    // },
    {
      label: "Login",
      link: "/auth/login",
    },
    {
      label: "Sign up",
      link: "/auth/signup",
    },
  ];
};

export default function Topbar() {
  const [{ token }] = useCookies(["token"]);
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
    <div className="flex justify-between items-center px-2 sm:px-8 py-4">
      <Logo Icon={FrankenotesLogo} text={title} />
      <div className="flex gap-4">
        {showDropdown ? (
          <Dropdown tabs={tabs(token)} />
        ) : (
          <Tabs tabs={tabs(token)} />
        )}

        {token && <LogoutButton />}
      </div>
    </div>
  );
}
