import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c2c2c",
    },
    secondary: {
      main: "#E6CA97",
    },
    gold: { main: "#E6CA97" },
    "white-gold": { main: "#D9D9D9" },
    "rose-gold": { main: "#E1A4A9" },
  },
  typography: {
    fontFamily: "'Montserrat', 'Roboto', 'sans-serif'",

    h1: {
      fontFamily: "'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'",
      fontWeight: 400,
      fontSize: "45px",
      letterSpacing: "1px",
    },

    h6: {
      fontFamily: "'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'",
      fontWeight: 500,
      fontSize: "14px",
    },

    body1: {
      fontFamily: "'Montserrat', 'Roboto', 'sans-serif'",
      fontSize: "15px",
    },
  },
});

export default theme;
