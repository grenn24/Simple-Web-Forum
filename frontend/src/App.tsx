import "./styles/App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";
import WelcomeScreen from "./pages/WelcomeScreen";
import Following from "./pages/Following";
import MainLayout from "./pages/MainLayout";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Topics from "./pages/Topics";
import Recommended from "./pages/Recommended";
import Bookmarked from "./pages/Bookmarked";
import Liked from "./pages/Liked";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Theme from "./styles/Theme";
import { ThemeProvider } from "@emotion/react";

function App() {
	const [leftNavBarExpandedStatus, setleftNavBarExpandedStatus] =
		useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const closeLeftNavBar = () => {
		setIsClosing(true);
		setleftNavBarExpandedStatus(false);
	};

	const handleLeftBarCloseTransitionEnd = () => {
		setIsClosing(false);
	};

	const openLeftNavBar = () => {
		if (!isClosing) {
			setleftNavBarExpandedStatus(!leftNavBarExpandedStatus);
		}
	};

	return (
		<>
			<ThemeProvider theme={Theme}>
				<BrowserRouter>
					<Routes>
						{/*Main Layout*/}
						<Route
							path="/"
							element={
								<MainLayout
									setLeftNavBarExpandedStatus={setleftNavBarExpandedStatus}
									openLeftNavBar={openLeftNavBar}
									closeLeftNavBar={closeLeftNavBar}
									leftNavBarExpandedStatus={leftNavBarExpandedStatus}
									handleLeftBarCloseTransitionEnd={
										handleLeftBarCloseTransitionEnd
									}
								/>
							}
						>
							<Route index element={<Home />} />
							<Route
								path="Following"
								element={<Following />}
							/>
							<Route path="Recommended" element={<Recommended />} />
							<Route
								path="Topics"
								element={<Topics />}
							/>
							<Route path="Bookmarked" element={<Bookmarked />} />
							<Route path="Liked" element={<Liked />} />
							<Route path="Settings" element={<Settings />} />
							<Route path="Profile" element={<Profile />} />
						</Route>
						{/*No Layout*/}
						<Route path="Welcome" element={<WelcomeScreen />} />
						<Route path="*" element={<Error />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}

export default App;
