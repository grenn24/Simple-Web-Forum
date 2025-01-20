import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Box } from "@mui/material";
import { useAppDispatch } from "../../utilities/redux";
import { incrementStage } from "./signUpSlice";
import { motion } from "motion/react";
interface Prop {}
const Welcome = ({}: Prop) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1.4 }}
			key={location.pathname}
		>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				<Button
					variant="contained"
					backgroundColor="primary.dark"
					handleButtonClick={() => navigate("Log-In")}
				>
					Log In
				</Button>
				<br />
				<br />
				<Button
					variant="contained"
					backgroundColor="primary.dark"
					handleButtonClick={() => {
						dispatch(incrementStage());
						navigate("Sign-Up/1");
					}}
				>
					Sign Up
				</Button>
			</Box>
		</motion.div>
	);
};

export default Welcome;
