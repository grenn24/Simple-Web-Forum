import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		mode: "light",
		//Button and Icon colours
		primary: {
			main: "#000000",
			light: "#e6e6e6",
			dark: "#374151",
		},
		secondary: {
			main: "#000000",
			light: "#a3a3a3",
		},
		//Background colours
		background: {
			paper: "#ffffff",
			default: "#ffffff",
		},
		//Font colours
		text: {
			primary: "rgba(0, 0, 0, 0.87)",
			secondary: "#374151",
			disabled: "rgba(0, 0, 0, 0.38)",
		},
		//Divider colour
		divider: "rgba(0, 0, 0, 0.21)",
	},
	typography: {
		fontFamily: "Nunito, Open Sans, Poppins",
		fontSize: 16,
		fontWeightRegular: 550,
		fontWeightLight: 300,
		fontWeightMedium: 500,
		fontWeightBold: 700,
	},
	shape: {
		//Button radius
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
