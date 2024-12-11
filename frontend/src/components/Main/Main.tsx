import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import LeftNavigationBar from "../LeftNavigationBar/LeftNavigationBar";
import Bookmarked from "./ContentBody/Bookmarked";
import Following from "./ContentBody/Following";
import Recommended from "./ContentBody/Recommended";
import Topics from "./ContentBody/Topics";
import Profile from "./ContentBody/Profile";
import WelcomeScreen from "./ContentBody/WelcomeScreen";
import Home from "./ContentBody/Home";
import ContentBody from "./ContentBody";

const drawerWidth = 300;


interface Prop {
	leftNavBarExpandedStatus: boolean;
	setLeftNavBarExpandedStatus: (x: boolean) => void;
	closeLeftNavBar: () => void;
	openLeftNavBar: () => void;
	handleLeftBarCloseTransitionEnd: () => void;
	setCurrentSection: (currentSection: string) => void;
	currentSection: string;
}
export default function MainBody({
	leftNavBarExpandedStatus,
	setLeftNavBarExpandedStatus,
	closeLeftNavBar,
	handleLeftBarCloseTransitionEnd,
	setCurrentSection,
	currentSection,
}: Prop) {
	const [height, setHeight] = useState(80);
	useEffect(() => {
		const x = document.getElementById("AppBar")?.offsetHeight;
		if (x) {
			setHeight(x);
		}
	}, []);

	const CurrentContentBody =
		ContentBody[currentSection as keyof typeof ContentBody];

	return (
		<>
			{/*Left Navigation Bar and Right Content Page*/}
			<Box
				sx={{ display: "flex", minHeight: "100vh", marginTop: `${height}px` }}
			>
				<LeftNavigationBar
					leftNavBarExpandedStatus={leftNavBarExpandedStatus}
					setLeftNavBarStatus={setLeftNavBarExpandedStatus}
					closeLeftNavBar={closeLeftNavBar}
					handleLeftBarCloseTransitionEnd={handleLeftBarCloseTransitionEnd}
					setCurrentSection={setCurrentSection}
				/>

				<CurrentContentBody />
			</Box>
		</>
	);
}
