import Head from "next/head";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
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
        <title>Fnshr - Log In</title>
      </Head>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AuthForm title={"Log In"} onSubmit={onSubmit} />
      </main>
    </>
  );
}
