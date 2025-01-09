import { Box, Breadcrumbs } from "@mui/material";
import whiteBackground from "../../assets/image/white-background.jpg";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAppSelector } from "../../utilities/reduxHooks";

const WelcomeLayout = () => {
	const navigate = useNavigate();
	const currentSignUpStage = useAppSelector(
		(state) => state.signUp.currentSignUpStage
	);
	useState(false);

	return (
		<>
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
				<Outlet />
			</Box>
			<Box
				position="absolute"
				bottom="4%"
				display={currentSignUpStage !== 0 ? "flex" : "none"}
				width="100%"
				justifyContent="center"
			>
				<Breadcrumbs separator="———">
					[
					<Button
						variant="contained"
						backgroundColor="green"
						handleButtonClick={() => navigate("/Welcome/Sign-Up/1")}
					>
						1
					</Button>
					,
					<Button
						variant="contained"
						backgroundColor="green"
						handleButtonClick={() => navigate("/Welcome/Sign-Up/2")}
						disabled={currentSignUpStage < 2}
					>
						2
					</Button>
					,
					<Button
						variant="contained"
						backgroundColor="green"
						handleButtonClick={() => navigate("/Welcome/Sign-Up/3")}
						disabled={currentSignUpStage < 3}
					>
						3
					</Button>
					]
				</Breadcrumbs>
			</Box>
		</>
	);
};

export default WelcomeLayout;
