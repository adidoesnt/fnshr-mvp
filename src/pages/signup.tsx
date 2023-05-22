import Head from "next/head";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  const onSubmit = (username: string, password: string) => {
    // submission logic
    console.log({
      username,
      password
    })
  }

  return (
    <>
      <Head>
        <title>Fnshr - Sign Up</title>
      </Head>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AuthForm title={"Sign Up"} onSubmit={onSubmit} />
      </main>
    </>
  );
}
