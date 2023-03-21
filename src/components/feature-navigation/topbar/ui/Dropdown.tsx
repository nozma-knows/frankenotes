import { useState, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import { ThemeProvider } from "@mui/material/styles";
import { IoMenu, IoClose } from "react-icons/io5";
import muiTheme from "@/components/ui/themes/MuiThemes";

type TabType = {
  label: string;
  link: string;
};

interface DropdownProps {
  tabs: TabType[];
}

const Options = ({
  tabs,
  close,
  router,
}: {
  tabs: TabType[];
  close: () => void;
  router: NextRouter;
}) => {
  const currentPath = `${router.pathname}`;
  return (
    <ThemeProvider theme={muiTheme}>
      <Dialog
        open
        onClose={close}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        }}
      >
        <div className="flex flex-col px-8 py-4 gap-2">
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
      </Dialog>
    </ThemeProvider>
  );
};

export default function Dropdown({ tabs }: DropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      {open ? (
        <>
          <IoClose
            className="flex md:hidden text-3xl button cursor-pointer"
            onClick={() => setOpen(false)}
          />
          <div>
            <Options tabs={tabs} router={router} close={() => setOpen(false)} />
          </div>
        </>
      ) : (
        <IoMenu
          className="flex md:hidden text-3xl button cursor-pointer"
          onClick={() => setOpen(true)}
        />
      )}
    </div>
  );
}
