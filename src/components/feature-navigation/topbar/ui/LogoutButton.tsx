import { IconButton } from "@/components/ui/buttons";
import { HiOutlineLogout } from "react-icons/hi";

const HandleLogout = () => console.log("Clicked Logout.");

export default function LogoutButton() {
  return (
    <div>
      <IconButton Icon={HiOutlineLogout} onClick={() => HandleLogout()} />
    </div>
  );
}
