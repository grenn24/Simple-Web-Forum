import { Box, Breadcrumbs } from "@mui/material";
import whiteBackground from "../../assets/image/white-background.jpg";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAppSelector } from "../../utilities/reduxHooks";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

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
				justifyContent={{ xs: "center", md: "space-evenly" }}
				alignItems="center"
			>
				<AnimatePresence mode="wait">
					<Outlet />
					{currentSignUpStage !== 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Box
								display={{ xs: "none", md: "flex" }}
								width="100%"
								justifyContent="center"
							>
								<Breadcrumbs separator="—————">
									[
									<Button
										variant="contained"
										backgroundColor="green"
										buttonStyle={{ py: 0 }}
										toolTipText="Step 1"
										handleButtonClick={() => navigate("/Welcome/Sign-Up/1")}
									>
										1
									</Button>
									,
									<Button
										variant="contained"
										backgroundColor="green"
										buttonStyle={{ py: 0 }}
										toolTipText="Step 2"
										handleButtonClick={() => navigate("/Welcome/Sign-Up/2")}
										disabled={currentSignUpStage < 2}
									>
										2
									</Button>
									,
									<Button
										variant="contained"
										backgroundColor="green"
										buttonStyle={{ py: 0 }}
										toolTipText="Step 3"
										handleButtonClick={() => navigate("/Welcome/Sign-Up/3")}
										disabled={currentSignUpStage < 3}
									>
										3
									</Button>
									]
								</Breadcrumbs>
							</Box>
						</motion.div>
					)}
				</AnimatePresence>
			</Box>
		</>
	);
};

export default WelcomeLayout;
