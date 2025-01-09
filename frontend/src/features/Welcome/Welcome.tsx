import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Box } from "@mui/material";
import { useAppDispatch } from "../../utilities/reduxHooks";
import { incrementStage } from "./signUpSlice";
interface Prop {}
const Welcome = ({}: Prop) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	return (
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
	);
};

export default Welcome;
