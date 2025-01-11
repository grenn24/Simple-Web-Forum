import Box from "@mui/material/Box";
import LeftNavigationBar from "./LeftNavigationBar";
import { Outlet } from "react-router-dom";
import TopHeader from "./TopHeader";
import Divider from "@mui/material/Divider";
import { useAppSelector } from "../../utilities/reduxHooks";
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel/LinearProgressWithLabel";
import Snackbar from "../../components/Snackbar";

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
	const { uploadID, uploadStatus, progress } = useAppSelector((state) => ({
		uploadID: state.createThread.uploadID,
		uploadStatus: state.createThread.uploadStatus,
		progress: state.createThread.progress,
	}));
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
					flexDirection: "row",
				}}
			>
				<LeftNavigationBar
					leftNavBarExpandedStatus={leftNavBarExpandedStatus}
					setLeftNavBarStatus={setLeftNavBarExpandedStatus}
					closeLeftNavBar={closeLeftNavBar}
					handleLeftBarCloseTransitionEnd={handleLeftBarCloseTransitionEnd}
				/>
				<Box maxWidth="100%" flexGrow={1} position="relative">
					<Box width="100%" position="fixed"  top={70}>
						{!uploadStatus && <LinearProgressWithLabel progress={progress} />}
					</Box>
					<Outlet />
				</Box>
			</Box>

			{/*Thread Upload Started snackbar*/}
			<Snackbar
				openSnackbar={progress === 100}
				message="Thread has been uploaded successfully"
				duration={1000}
				undoButton={false}
			/>
		</Box>
	);
}
