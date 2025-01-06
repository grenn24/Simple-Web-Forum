import { Box } from "@mui/material";
import whiteBackground from "../assets/image/white-background.jpg";
import { useState } from "react";
import LogIn from "../features/WelcomeScreen/LogIn";
import SignUp from "../features/WelcomeScreen/SignUp";
import MainButton from "../features/WelcomeScreen/MainButton";

const WelcomeScreen = () => {
	const [formStatus, setFormStatus] = useState("none");
	return (
		<Box
			sx={{
				backgroundImage: `url(${whiteBackground})`,
				backgroundSize: "cover",
			}}
			width="100vw"
			height="100vh"
			display="flex"
			flexDirection="row"
			justifyContent="center"
			alignItems="center"
		>
			<Box
				height="auto"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				<MainButton
					setFormStatus={setFormStatus}
					opacity={formStatus === "none" ? 1 : 0}
					visibility={formStatus === "none" ? "visible" : "hidden"}
				/>
				<LogIn
					setFormStatus={setFormStatus}
					opacity={formStatus === "log in" ? 1 : 0}
					visibility={formStatus === "log in" ? "visible" : "hidden"}
				/>
				<SignUp
					setFormStatus={setFormStatus}
					opacity={formStatus === "sign up" ? 1 : 0}
					visibility={formStatus === "sign up" ? "visible" : "hidden"}
				/>
			</Box>
		</Box>
	);
};

export default WelcomeScreen;
