import Head from "next/head";
import AuthForm, { AuthFormNavigation } from "@/components/AuthForm";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setGlobalUser } from "@/app/features/user/userSlice";
import { useRouter } from "next/router";
import { useWindowSize } from "@/app/hooks";
import { useState } from "react";

export default function SignupPage() {
  const size = useWindowSize();
  const URI = "/api/signup";

  const router = useRouter();
  const dispatch = useDispatch();

  const [ submitting, setSubmitting ] = useState(false);

  const onSubmit = async (username: string, password: string) => {
    setSubmitting(true);
    try {
      const response = await axios.post(URI, {
        username,
        password,
      });
      const { points, friends, admin } = response.data;
      dispatch(setGlobalUser({ username, points, friends, admin }));
      console.log(response.data);
      router.push("/home");
    } catch (err) {
      console.log(err);
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
        />
      </main>
    </>
  );
}
