import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import LeftNavigationBar from "../LeftNavigationBar/LeftNavigationBar";
import RightContentBody from "./ContentBody";

const drawerWidth = 300;

interface Prop {
	leftNavBarStatus: boolean;
	setLeftNavBarStatus: (x: boolean) => void;
	closeLeftNavBar: () => void;
	openLeftNavBar: () => void;
	handleLeftBarTransitionEnd: () => void;
	setCurrentSection: (currentSection: string)=>void;
}
export default function MainBody({
	leftNavBarStatus,
	setLeftNavBarStatus,
	closeLeftNavBar,
	handleLeftBarTransitionEnd,
	setCurrentSection
}: Prop) {
	const [height, setHeight] = useState(80);
	useEffect(() => {
		const x = document.getElementById("AppBar")?.offsetHeight;
		if (x) {
			setHeight(x);
		}
	}, []);

	return (
		<>
			{/*Left Navigation Bar and Right Content Page*/}
			<Box
				sx={{ display: "flex", minHeight: "100vh", marginTop: `${height}px` }}
			>
				<LeftNavigationBar
					drawerWidth={drawerWidth}
					leftNavBarStatus={leftNavBarStatus}
					setLeftNavBarStatus={setLeftNavBarStatus}
					closeLeftNavBar={closeLeftNavBar}
					handleLeftBarTransitionEnd={handleLeftBarTransitionEnd}
					setCurrentSection={setCurrentSection}
				/>

				<RightContentBody />
			</Box>
		</>
	);
}
