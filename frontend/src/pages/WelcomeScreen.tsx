import { Box } from "@mui/material";
import whiteBackground from "../assets/image/white-background.jpg";

const WelcomeScreen = () => {
	return (
		<Box
			sx={{
				backgroundImage:
					`url(${whiteBackground})`,
				backgroundSize: "cover",
			}}
			width="100vw"
			height="100vh"
		></Box>
	);
};

export default WelcomeScreen;
