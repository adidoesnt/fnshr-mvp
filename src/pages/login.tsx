import Head from "next/head";
import AuthForm, { AuthFormNavigation } from "@/components/AuthForm";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setGlobalUser } from "@/app/features/user/userSlice";

const URI = "/api/login";

export default function LoginPage() {
  const dispatch = useDispatch();

  const onSubmit = async (username: string, password: string) => {
    try {
      const response = await axios.post(URI, {
        username,
        password,
      });
      dispatch(setGlobalUser(username));
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
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
