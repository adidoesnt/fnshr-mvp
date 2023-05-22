import Head from "next/head";
import AuthForm, { AuthFormNavigation } from "@/components/AuthForm";

export default function LoginPage() {
  const onSubmit = (username: string, password: string) => {
    // submission logic
    console.log({
      username,
      password,
    });
  };

  const navigation: AuthFormNavigation = {
    link: { uri: "/signup", description: "Sign up." },
    text: "Don't have an account?",
  };

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
        <AuthForm
          title={"Log In"}
          onSubmit={onSubmit}
          navigation={navigation}
        />
      </main>
    </>
  );
}
