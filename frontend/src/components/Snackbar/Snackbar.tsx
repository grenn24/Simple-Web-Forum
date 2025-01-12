import { Snackbar as SnackbarBase, SxProps, Theme } from "@mui/material";
import Button from "../Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface Prop {
	openSnackbar: boolean;
	setOpenSnackbar?: (state: boolean) => void;
	handleSnackbarClose?: () => void;
	message: string;
	duration: number;
	undoButton?: boolean;
	handleUndoButtonClick?: () => void;
	style?: SxProps<Theme>;

	anchorOrigin?: {
		vertical: "top" | "bottom";
		horizontal: "left" | "center" | "right";
	};
}
const Snackbar = ({
	openSnackbar,
	setOpenSnackbar,
	handleSnackbarClose,
	message,
	duration,
	undoButton = true,
	handleUndoButtonClick,
	style,
	anchorOrigin

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
				anchorOrigin={anchorOrigin}
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
					...style,
				}}
			/>
		</>
	);
};

export default Snackbar;
