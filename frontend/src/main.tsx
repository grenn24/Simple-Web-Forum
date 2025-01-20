import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/Index.css";
import App from "./App.tsx";
import store from "./store.ts";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";



createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
				<App />
			</GoogleOAuthProvider>
		</Provider>
	</StrictMode>
);
