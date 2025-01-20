import Box from "@mui/material/Box";
import LeftNavigationBar from "./LeftNavigationBar";
import { Outlet } from "react-router-dom";
import TopHeader from "./TopHeader";
import Divider from "@mui/material/Divider";
import { useAppSelector } from "../../utilities/redux";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel/CircularProgressWithLabel";
import { Typography } from "@mui/material";
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
	const { uploads } = useAppSelector((state) => ({
		uploads: state.createThread.uploads,
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
					<Box
						width="auto"
						height="auto"
						position="fixed"
						right={20}
						bottom={20}
					>
						{uploads.size !== 0 &&
							Array.from(uploads.values()).map((upload, index) => (
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-end"
									alignItems="center"
								>
									<Typography marginRight={2}>{upload.title}</Typography>
									<CircularProgressWithLabel
										key={index}
										progress={upload.progress}
									/>
									<Box position="fixed">
										{/*Upload success snackbar*/}
										<Snackbar
											openSnackbar={
												(upload.uploadStatus as string) === "complete"
											}
											message="Upload completed"
											duration={2000}
											undoButton={false}
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "center",
											}}
										/>
										{/*Upload error snackbar*/}
										<Snackbar
											openSnackbar={(upload.uploadStatus as string) === "error"}
											message="An error occurred during the upload, please try again."
											duration={2000}
											undoButton={false}
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "center",
											}}
										/>
									</Box>
								</Box>
							))}
					</Box>

					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
