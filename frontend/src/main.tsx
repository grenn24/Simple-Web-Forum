import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#9ece00",
		},
	},
	typography: {
		fontFamily: "Nunito",
		fontSize: 16,
		fontWeightRegular: 550,
	},
	shape: {
		borderRadius: 20,
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</StrictMode>
);
