import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { IoMenu, IoClose } from "react-icons/io5";
import LogoutButton from "@/components/ui/buttons/LogoutButton";
import TopBarDropdown from "./TopbarDropdown";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import Logo from "../../icons/logo.svg";

const title = "Frankenotes";

export default function Topbar() {
  const [{ token }] = useCookies(["token"]);
  const pages = ({ token }: { token: string | null }) => {
    if (token) {
      return [
        {
          label: "Notepad",
          link: "/app/notepad",
        },
      ];
    }
    return [
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
        className: "bg-main-light text-main-light p-2 rounded-lg",
      },
    ];
  };

  const router = useRouter();
  const size = useWindowSize();
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    if (showDropDown && size.width > 770) {
      setShowDropDown(false);
    }
  }, [showDropDown, size]);

  const pathRoute = ({ token }: { token: string }) =>
    token ? `${router.pathname}` : `/${router.pathname.split("/")[1]}`;

  return (
    <div className="flex justify-between items-center w-full px-2 sm:px-8 text-main-dark bg-main-dark">
      {/* <Link href="/" className="flex items-center gap-2 logo">
        <div className="bg-red-900">
          <Image src={Logo} alt="Frankenotes " width={60} />
        </div>
        <div className="text-2xl lg:text-3xl font-bold button">{title}</div>
      </Link> */}
      <div className="flex gap-2 w-fit h-full items-center">
        <Image src={Logo} alt="Frankenotes logo" width={40} />
        {/* <div className="text-2xl lg:text-3xl font-bold button">{title}</div> */}
        <div className="">{title}</div>
      </div>
      <div className={`flex items-center gap-4`}>
        {pages({ token }).map(
          (page: { label: string; link: string; className?: string }) => {
            return (
              <Link
                className={`${
                  page.link === pathRoute({ token }) && "text-[#a56baf]"
                } text-lg font-semibold button hidden md:flex ${
                  page.className
                }`}
                key={page.label}
                href={page.link}
              >
                {page.label}
              </Link>
            );
          }
        )}
        <div>
          {showDropDown ? (
            <>
              <IoClose
                className="flex md:hidden text-3xl button cursor-pointer"
                onClick={() => setShowDropDown(false)}
              />
              <div className="flex md:hidden">
                <TopBarDropdown
                  pages={pages({ token })}
                  close={() => setShowDropDown(false)}
                />
              </div>
            </>
          ) : (
            <IoMenu
              className="flex md:hidden text-3xl button cursor-pointer"
              onClick={() => setShowDropDown(true)}
            />
          )}
        </div>
        {token && (
          <div className="flex gap-8 pl-8">
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
}
