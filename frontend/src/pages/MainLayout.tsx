import Box from "@mui/material/Box";
import LeftNavigationBar from "../features/MainLayout/LeftNavigationBar";
import { Outlet} from "react-router-dom";
import TopHeader from "../features/MainLayout/TopHeader";
import Divider from "@mui/material/Divider";


interface Prop {
	leftNavBarExpandedStatus: boolean;
	setLeftNavBarExpandedStatus: (x: boolean) => void;
	closeLeftNavBar: () => void;
	openLeftNavBar: () => void;
	handleLeftBarCloseTransitionEnd: () => void;
}
export default function MainBody({
	leftNavBarExpandedStatus,
	setLeftNavBarExpandedStatus,
	closeLeftNavBar,
	handleLeftBarCloseTransitionEnd,
	openLeftNavBar,
}: Prop) {

	return (
		<Box width="100vw" height="100vh">
			<TopHeader
				openLeftNavBar={openLeftNavBar}
				leftNavBarStatus={leftNavBarExpandedStatus}
			/>
			<Divider />
			{/*Left Navigation Bar and Right Content Page*/}
			<Box
				sx={{
					display: "flex",
					marginTop: `80px`,
					flexDirection: "row"
				}}
			>
				<LeftNavigationBar
					leftNavBarExpandedStatus={leftNavBarExpandedStatus}
					setLeftNavBarStatus={setLeftNavBarExpandedStatus}
					closeLeftNavBar={closeLeftNavBar}
					handleLeftBarCloseTransitionEnd={handleLeftBarCloseTransitionEnd}
				/>
				<Box width="100%">
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
