import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { store, persistor } from "@/app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { fetchTasks, markTasksOverdue } from "@/app/features/tasks/tasksSlice";
import { fetchUsers } from "@/app/features/users/usersSlice";
import { useWindowSize } from "@/app/hooks";
import theme from "@/app/theme";

store.dispatch(markTasksOverdue()).then(() => {
  store.dispatch(fetchUsers());
  store.dispatch(fetchTasks());
});
setInterval(() => {
  store.dispatch(fetchTasks()).then(() => {
    store.dispatch(fetchUsers());
    store.dispatch(markTasksOverdue());
  });
}, 60000);

export default function App({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = useState(false);
  const size = useWindowSize();
  const isPortrait = size.width < size.height;

  const handleResize = () => {
    require("events").EventEmitter.defaultMaxListeners = 15;
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          {isMobile && isPortrait ? (
            <div
              style={{
                background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                color: "white",
                overflowY: "auto",
              }}
            >
              <Component {...pageProps} />
            </div>
          ) : (
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                color: "white",
              }}
            >
              The Fnshr web-app is currently only supported on mobile browsers,
              in portrait orientation.
            </div>
          )}
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}
