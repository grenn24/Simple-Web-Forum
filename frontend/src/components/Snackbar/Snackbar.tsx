import { Snackbar as SnackbarBase } from "@mui/material";
import Button from "../Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Prop {
	openSnackbar: boolean;
	setOpenSnackbar?: (state: boolean) => void;
	handleSnackbarClose?: () => void;
	message: string;
	duration: number;
	undoButton?: boolean;
	handleUndoButtonClick?: ()=>void
}
const Snackbar = ({
	openSnackbar,
	setOpenSnackbar,
	handleSnackbarClose,
	message,
	duration,
	undoButton = true,
	handleUndoButtonClick,
}: Prop) => {
	const action = (
		<>
			{undoButton && (
				<Button
					color="secondary"
					size="small"
					handleButtonClick={(event: React.MouseEvent<HTMLElement>) => {
						event.stopPropagation();
						setOpenSnackbar && setOpenSnackbar(false);
						handleUndoButtonClick && handleUndoButtonClick();
					}}
				>
					UNDO
				</Button>
			)}

			<Button
				size="small"
				aria-label="close"
				color="inherit"
				handleButtonClick={(event: React.MouseEvent<HTMLElement>) => {
					event.stopPropagation();
					handleSnackbarClose && handleSnackbarClose();
					setOpenSnackbar && setOpenSnackbar(false);
				}}
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
					setOpenSnackbar && setOpenSnackbar(false);
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
