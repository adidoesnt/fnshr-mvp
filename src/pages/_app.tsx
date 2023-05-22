import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  return (
    <ChakraProvider>
      {isMobile ? (
        <Component {...pageProps} />
      ) : (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          The Fnshr web-app is currently only supported on mobile browsers.
        </div>
      )}
    </ChakraProvider>
  );
}
