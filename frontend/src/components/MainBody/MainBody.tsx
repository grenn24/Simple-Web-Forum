import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import LeftNavigationBar from "./LeftNavigationBar/LeftNavigationBar";
import RightContentBody from "./RightContentBody";


const drawerWidth = 270;

export default function MainBody() {
	return (
		<>
			{/*Left Navigation Bar and Right Content Page*/}
			<Box sx={{ display: "flex" }}>
				<CssBaseline />

				<LeftNavigationBar drawerWidth={drawerWidth} />

				<RightContentBody />
			</Box>
		</>
	);
}
