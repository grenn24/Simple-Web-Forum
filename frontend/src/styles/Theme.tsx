import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#000000",
            light: "#a3a3a3",
            dark: "#374151"
        },
        secondary: {
            main: "#000000",
            light: "#a3a3a3",
        },
    },
    typography: {
        fontFamily: "Nunito, Open Sans, Poppins",
        fontSize: 16,
        fontWeightRegular: 550,
    },
    shape: {
        borderRadius: 20,
    },
    zIndex: {
        mobileStepper: 1000,
        fab: 1050,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
    },
});

export default theme;