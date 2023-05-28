import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Loading from "@/components/Loading";
import Head from "next/head";
import { useWindowSize } from "@/app/hooks";
import BackButton from "@/components/BackButton";
import AdminForm from "@/components/AdminForm";

function Content() {
  const size = useWindowSize();

  return (
    <>
      <Head>
        <title>Fnshr - Add Payment</title>
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: size.width,
          height: size.height,
        }}
      >
        <BackButton w={"90%"} mt={"5%"} />
        <AdminForm />
      </main>
    </>
  );
}

export default function Admin() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const { username, admin } = user;

  const auth = username !== "" || admin;

  if (!auth) {
    router.push("/login");
  }

  return auth ? <Content /> : <Loading />;
}
