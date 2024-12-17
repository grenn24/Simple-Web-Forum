import { Box } from "@mui/material";
import whiteBackground from "../assets/image/white-background.jpg";
import Button from "../components/Button";
import { useState } from "react";
import LogIn from "../features/WelcomeScreen/LogIn";
import SignUp from "../features/WelcomeScreen/SignUp";

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
			justifyContent={formStatus === "none" ? "center" : "space-evenly"}
		>
			<Box
				height="auto"
				width="50%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				<Button
					variant="contained"
					backgroundColor="primary.dark"
					handleButtonClick={() => setFormStatus("log in")}
				>
					Log In
				</Button>
				<br />
				<br />
				<Button
					variant="contained"
					backgroundColor="primary.dark"
					handleButtonClick={() => setFormStatus("sign up")}
				>
					Sign Up
				</Button>
			</Box>
			<Box
				alignItems="center"
				width={formStatus !== "none" ? "50%" : 0}
				height={formStatus !== "none" ? "auto" : 0}
				visibility={formStatus !== "none" ? "visible" : "hidden"}
				sx={{
					transition: "all 1.0s ease-in-out",
					opacity: formStatus !== "none" ? 1 : 0,
				}}
			>
				<LogIn
					opacity={formStatus === "log in" ? 1 : 0}
					visibility={formStatus === "log in" ? "visible" : "hidden"}
				/>
				<SignUp
					opacity={formStatus === "sign up" ? 1 : 0}
					visibility={formStatus === "sign up" ? "visible" : "hidden"}
				/>
			</Box>
		</Box>
	);
};

export default WelcomeScreen;
