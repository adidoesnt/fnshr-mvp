import Head from "next/head";
import AuthForm, { AuthFormNavigation } from "@/components/AuthForm";
import axios from "axios";
import { fetchGlobalUser } from "@/app/features/user/userSlice";
import { useRouter } from "next/router";
import { useWindowSize } from "@/app/hooks";
import { useState } from "react";
import { store } from "@/app/store";
import { fetchUsers } from "@/app/features/users/usersSlice";
import type { AuthStatus } from "@/components/AuthForm";
import { defaultReqConfig } from "./api/preflight";

export default function SignupPage() {
  const size = useWindowSize();
  const URI = "/api/signup";
  const router = useRouter();

  const [ submitting, setSubmitting ] = useState(false);
  const [error, setError] = useState<AuthStatus>("Success");

  const onSubmit = async (username: string, password: string) => {
    setSubmitting(true);
    try {
      const response = await axios.post(URI, {
        username,
        password,
      }, defaultReqConfig);
      await store.dispatch(fetchUsers());
      await store.dispatch(fetchGlobalUser(username));
      console.log(response.data);
      router.push("/home");
    } catch (err: any) {
      const errMessage = err.response.data.status;
      setError(errMessage);
    }
    setSubmitting(false);
  };

  const navigation: AuthFormNavigation = {
    link: { uri: "/login", description: "Log in." },
    text: "Already have an account?",
  };

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
          width: size.width,
          height: size.height
        }}
      >
        <AuthForm
          title={"Sign Up"}
          onSubmit={onSubmit}
          navigation={navigation}
          submitting={submitting}
          error={error}
          setError={setError}
        />
      </main>
    </>
  );
}
