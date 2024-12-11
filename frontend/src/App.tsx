import "./App.css";
import { useState, useEffect } from "react";
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

	const [currentSection, setCurrentSection] = useState<string>("Home");

	return (
		<>
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
								setCurrentSection={setCurrentSection}
								currentSection={currentSection}
							/>
						}
					>
						<Route index element={<Home />} />
						<Route
							path="Following"
							element={<Following setCurrentSection={setCurrentSection} />}
						/>
						<Route path="Recommended" element={<Recommended />} />
						<Route
							path="Topics"
							element={<Topics setCurrentSection={setCurrentSection}/>}
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
		</>
	);
}

export default App;
