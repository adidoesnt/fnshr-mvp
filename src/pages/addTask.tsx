import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import TaskForm, { TaskFormProps } from "@/components/TaskForm";
import Head from "next/head";
import FnshrPoints, { FnshrPointsProps } from "@/components/FnshrPoints";
import BackButton from "@/components/BackButton";
import { useWindowSize } from "@/app/hooks";

type ContentProps = TaskFormProps & FnshrPointsProps;

function Content({ username, points }: ContentProps) {
  const size = useWindowSize();
  return (
    <>
      <Head>
        <title>Fnshr - Add Task</title>
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
        <FnshrPoints points={points} />
        <TaskForm username={username} />
      </main>
    </>
  );
}

export default function AddTask() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const { username, points } = user;

  const auth = username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? <Content username={username} points={points} /> : <Loading />;
}
