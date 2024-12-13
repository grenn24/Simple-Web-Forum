import { Snackbar as SnackbarBase } from "@mui/material";
import Button from "../Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Prop {
	openSnackbar: boolean;
	setOpenSnackbar: (state: boolean) => void;
	handleSnackbarClose?: () => void;
	message: string;
	duration: number;
}
const Snackbar = ({
	openSnackbar,
	setOpenSnackbar,
	handleSnackbarClose,
	message,
	duration,
}: Prop) => {
	const action = (
		<>
			<Button
				color="secondary"
				size="small"
				handleButtonClick={() => setOpenSnackbar(false)}
			>
				UNDO
			</Button>
			<Button
				size="small"
				aria-label="close"
				color="inherit"
				handleButtonClick={() => {
					handleSnackbarClose && handleSnackbarClose();
					setOpenSnackbar(false);
				}}
				iconOnly
				buttonIcon={<CloseRoundedIcon fontSize="small" />}
			/>
		</>
	);
	return (
		<>
			<SnackbarBase
				open={openSnackbar}
				autoHideDuration={duration}
				onClose={() => {
					handleSnackbarClose && handleSnackbarClose();
					setOpenSnackbar(false);
				}}
				message={message}
				action={action}
				sx={{
					"& .MuiSnackbarContent-root": {
						backgroundColor: "background.default",
					},
					"& .MuiSnackbarContent-message": {
						color: "text.primary",
					},
				}}
			/>
		</>
	);
};

export default Snackbar;
