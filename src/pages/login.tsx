import Head from "next/head";
import AuthForm, { AuthFormNavigation } from "@/components/AuthForm";
import axios from "axios";
import { fetchGlobalUser } from "@/app/features/user/userSlice";
import { useRouter } from "next/router";
import { useWindowSize } from "@/app/hooks";
import { useState } from "react";
import { store } from "@/app/store";
import { fetchUsers } from "@/app/features/users/usersSlice";

export default function LoginPage() {
  const URI = "/api/login";
  const router = useRouter();

  const size = useWindowSize();

  const [ submitting, setSubmitting ] = useState(false);

  const onSubmit = async (username: string, password: string) => {
    setSubmitting(true);
    try {
      const response = await axios.post(URI, {
        username,
        password,
      });
      await store.dispatch(fetchUsers());
      await store.dispatch(fetchGlobalUser(username));
      console.log(response.data);
      router.push("/home");
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
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
          width: size.width,
          height: size.height
        }}
      >
        <AuthForm
          title={"Log In"}
          onSubmit={onSubmit}
          navigation={navigation}
          submitting={submitting}
        />
      </main>
    </>
  );
}
