import "./styles/App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Thread from "./pages/Thread";
import Theme from "./styles/Theme";
import { ThemeProvider } from "@emotion/react";
import CreateThread from "./pages/CreateThread";

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
						{/*Pages using Main Layout*/}
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
							<Route path="Following" element={<Following />} />
							<Route path="Recommended" element={<Recommended />} />
							<Route path="Topics" element={<Topics />} />
							<Route path="Bookmarked" element={<Bookmarked />} />
							<Route path="Liked" element={<Liked />} />
							<Route path="Settings" element={<Settings />} />
							<Route path="Profile/:authorId" element={<Profile />} />
							<Route path="Thread/:threadId" element={<Thread />} />
							<Route path="Create-Thread" element={<CreateThread />} />
						</Route>
						{/*Pages without Layout*/}
						<Route path="Welcome" element={<WelcomeScreen />} />
						{/*Missed Routes*/}
						<Route path="*" element={<Error />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}

export default App;
