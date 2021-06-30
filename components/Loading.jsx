import CircularProgress from "@material-ui/core/CircularProgress";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Image from "next/image";
import { Logo } from "../pages/login";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#301796",
    },
  },
});

const Loading = () => {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <Logo src="/output-onlinepngtools.png" width={200} height={200} />
        <br />
        <ThemeProvider theme={theme}>
          <CircularProgress size={45} style={{ marginTop: 40 }} />
        </ThemeProvider>
      </div>
    </center>
  );
};

export default Loading;
