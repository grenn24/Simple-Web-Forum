import TopHeader from "./components/TopHeader";
import MainBody from "./components/Main";
import "./App.css";
import { Divider } from "@mui/material";
import { useState } from "react";

function App() {
	const [leftNavBarStatus, setleftNavBarStatus] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const closeLeftNavBar = () => {
		setIsClosing(true);
		setleftNavBarStatus(false);
	};

	const handleLeftBarTransitionEnd = () => {
		setIsClosing(false);
	};

	const openLeftNavBar = () => {
		if (!isClosing) {
			setleftNavBarStatus(!leftNavBarStatus);
		}
	};

	const [currentSection, setCurrentSection] = useState("Home");

	return (
		<>
			<TopHeader openLeftNavBar={openLeftNavBar} setCurrentSection={setCurrentSection} />
			<Divider />
			<MainBody
				setLeftNavBarStatus={setleftNavBarStatus}
				openLeftNavBar={openLeftNavBar}
				closeLeftNavBar={closeLeftNavBar}
				leftNavBarStatus={leftNavBarStatus}
				handleLeftBarTransitionEnd={handleLeftBarTransitionEnd}
				setCurrentSection={setCurrentSection}
			/>
		</>
	);
}

export default App;
