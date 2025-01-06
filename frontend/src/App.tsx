import "./styles/App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import Following from "./pages/Following";
import MainLayout from "./pages/MainLayout";
//import Error from "./pages/Error";
import Home from "./pages/Home";
import Topics from "./pages/Topics";
import Recommended from "./pages/Recommended";
import Bookmarked from "./pages/Bookmarked";
import Liked from "./pages/Liked";
import Settings from "./pages/Settings";
import Thread from "./pages/Thread";
import Theme from "./styles/Theme";
import { ThemeProvider } from "@emotion/react";
import CreateThread from "./pages/CreateThread";
import AutoScrollToTop from "./utilities/AutoScrollToTop";
import Authentication from "./components/AuthenticationWrapper";
import Error from "./pages/Error";
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

	return (
		<>
			<ThemeProvider theme={Theme}>
				<BrowserRouter>
					<Routes>
						{/*Protected Routes using Main Layout and require jwt token authentication*/}
						<Route path="" element={<Authentication />}>
							<Route
								path=""
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
								<Route path="Topics/:topicID" element={<Topics />} />
								<Route path="Bookmarked" element={<Bookmarked />} />
								<Route path="Liked" element={<Liked />} />
								<Route path="Settings" element={<Settings />} />
								<Route path="Profile/:authorID" element={<Profile />} />
								<Route path="Thread/:threadID" element={<Thread />} />
								<Route path="Create-Thread" element={<CreateThread />} />
							</Route>
						</Route>

						{/*Non-protected routes*/}
						<Route path="Welcome" element={<WelcomeScreen />} />
						{/*Missed Routes*/}
						<Route path="*" element={<Error />} />
					</Routes>
					<AutoScrollToTop />
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}

export default App;
