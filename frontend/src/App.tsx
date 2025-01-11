import "./styles/App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeLayout from "./Layouts/WelcomeLayout/WelcomeLayout";
import Following from "./pages/Following";
import MainLayout from "./Layouts/MainLayout/MainLayout";
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
import Welcome from "./features/Welcome/Welcome";
import LogIn from "./features/Welcome/LogIn";
import SignUpStage1 from "./features/Welcome/SignUpStage1";
import SignUpStage2 from "./features/Welcome/SignUpStage2";
import SignUpStage3 from "./features/Welcome/SignUpStage3";

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
						{/*Protected Routes that require jwt token authentication*/}
						<Route path="/" element={<Authentication />}>
							{/*Using Main Layout*/}
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
						<Route path="/Welcome" element={<WelcomeLayout />}>
							<Route index element={<Welcome />} />
							<Route path="Log-In" element={<LogIn />} />
							<Route path="Sign-Up">
								<Route path="1" element={<SignUpStage1 />} />
								<Route path="2" element={<SignUpStage2 />} />
								<Route path="3" element={<SignUpStage3 />} />
							</Route>
						</Route>
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
