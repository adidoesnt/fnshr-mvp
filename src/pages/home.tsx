import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Head from "next/head";
import FnshrPoints from "@/components/FnshrPoints";

export default function Home() {
  const user = useSelector(selectGlobalUser);
  const points: number = user.points;

  return (
    <>
      <Head>
        <title>Fnshr - Home</title>
      </Head>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FnshrPoints points={points} />
      </main>
    </>
  );
}
