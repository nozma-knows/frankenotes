import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import { DeleteSessionMutation } from "@/components/graph";
import { Session } from "@/__generated__/graphql";
import { IconButton } from "@/components/ui/buttons";
import { HiOutlineLogout } from "react-icons/hi";

export default function LogoutButton() {
  const router = useRouter();

  const [_, __, removeCookie] = useCookies(["token"]);

  const [deleteSession, { data, loading, error }] = useMutation(
    DeleteSessionMutation,
    {
      onCompleted: (data: { login: Session }) => {
        removeCookie("token", { path: "/" });
        localStorage.removeItem("token");
        router.push("/");
      },
      onError: (error) => {
        console.log("Error logging out: ", error);
      },
    }
  );

  return (
    <div>
      <IconButton Icon={HiOutlineLogout} onClick={() => deleteSession()} />
    </div>
  );
}
