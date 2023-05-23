import Head from "next/head";
import AuthForm, { AuthFormNavigation } from "@/components/AuthForm";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setGlobalUser } from "@/app/features/user/userSlice";
import { useRouter } from "next/router";

export default function SignupPage() {
  const URI = "/api/signup";
  
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (username: string, password: string) => {
    try {
      const response = await axios.post(URI, {
        username,
        password,
      });
      dispatch(setGlobalUser(username));
      console.log(response.data);
      router.push("/home");
    } catch (err) {
      console.log(err)
    }
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
        }}
      >
        <AuthForm
          title={"Sign Up"}
          onSubmit={onSubmit}
          navigation={navigation}
        />
      </main>
    </>
  );
}
