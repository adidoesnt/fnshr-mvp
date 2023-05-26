import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Loading from "@/components/Loading";

function Content() {
    return <></>
}

export default function Admin() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const { username, admin } = user;

  const auth = user.username !== "" || user.admin;

  if (!auth) {
    router.push("/login");
  }

  return auth ? (
    <Content  />
  ) : (
    <Loading />
  );
}
