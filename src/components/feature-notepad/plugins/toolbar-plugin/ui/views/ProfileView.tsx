import { BsPerson } from "react-icons/bs";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import { DeleteSessionMutation } from "@/components/graph";
import { Session } from "@/__generated__/graphql";
import { HiOutlineLogout } from "react-icons/hi";
import DropDown, { DropDownItem } from "@/components/ui/form-fields/DropDown";

export default function ProfileView() {
  const router = useRouter();

  const [_, __, removeCookie] = useCookies(["token"]);

  const [deleteSession, { data, loading, error }] = useMutation(
    DeleteSessionMutation,
    {
      onCompleted: (data: { login: Session }) => {
        console.log("delete session completed");
        removeCookie("token", { path: "/" });
        localStorage.removeItem("token");
        router.push("/");
      },
      // onError: (error) => setErrorMessage(error.message),
    }
  );

  return (
    <DropDown
      disabled={false}
      buttonClassName="toolbar-item block-controls"
      Icon={BsPerson}
      buttonLabel="Profile"
      buttonAriaLabel="Profile button"
      noArrow
      round
    >
      <DropDownItem
        onClick={() => deleteSession()}
        Icon={HiOutlineLogout}
        label="Logout"
      />
    </DropDown>
  );
}
