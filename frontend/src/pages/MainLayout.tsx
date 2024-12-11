import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import LeftNavigationBar from "../components/LeftNavigationBar";
import ContentBody from "../components/Main/ContentBody";
import { Outlet, Link } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import Divider from "@mui/material/Divider";

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
	openLeftNavBar
}: Prop) {
	const [offsetHeight, setOffsetHeight] = useState(80);
	useEffect(() => {
		const x = document.getElementById("AppBar")?.offsetHeight;
		if (x) {
			setOffsetHeight(x);
		}
	}, []);

	const CurrentContentBody =
		ContentBody[currentSection as keyof typeof ContentBody];

	return (
		<>
			<TopHeader
				openLeftNavBar={openLeftNavBar}
				setCurrentSection={setCurrentSection}
				leftNavBarStatus={leftNavBarExpandedStatus}
			/>
			<Divider />
			{/*Left Navigation Bar and Right Content Page*/}
			<Box
				sx={{
					display: "flex",
					marginTop: `80px`,
					justifyContent: "flex-start",
				}}
			>
				<LeftNavigationBar
					leftNavBarExpandedStatus={leftNavBarExpandedStatus}
					setLeftNavBarStatus={setLeftNavBarExpandedStatus}
					closeLeftNavBar={closeLeftNavBar}
					handleLeftBarCloseTransitionEnd={handleLeftBarCloseTransitionEnd}
					setCurrentSection={setCurrentSection}
				/>
				<Box sx={{ width: "100%", position: "relative" }}>
					<Outlet />
				</Box>
			</Box>
		</>
	);
}
