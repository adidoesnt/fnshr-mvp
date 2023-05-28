import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#628AD7",
    secondary: "#91C4E1",
  },
  components: {
    Button: {
      baseStyle: {
        color: "Black",
      },
    },
  },
});

export default theme;
