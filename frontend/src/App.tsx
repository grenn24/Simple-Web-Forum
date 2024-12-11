import TopHeader from "./components/TopHeader";
import Main from "./components/Main";
import "./App.css";
import { Divider } from "@mui/material";
import { useState, useEffect } from "react";

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
			<TopHeader
				openLeftNavBar={openLeftNavBar}
				setCurrentSection={setCurrentSection}
				leftNavBarStatus={leftNavBarExpandedStatus}
			/>
			<Divider />
			<Main
				setLeftNavBarExpandedStatus={setleftNavBarExpandedStatus}
				openLeftNavBar={openLeftNavBar}
				closeLeftNavBar={closeLeftNavBar}
				leftNavBarExpandedStatus={leftNavBarExpandedStatus}
				handleLeftBarCloseTransitionEnd={handleLeftBarCloseTransitionEnd}
				setCurrentSection={setCurrentSection}
				currentSection={currentSection}
			/>
		</>
	);
}

export default App;
