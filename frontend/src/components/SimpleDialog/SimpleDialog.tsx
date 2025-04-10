import { Breakpoint, Dialog, DialogTitle} from "@mui/material";
import {AnimatePresence, motion} from "motion/react"

interface Prop {
	children?: React.ReactNode;
	openDialog: boolean;
	setOpenDialog: (state: boolean) => void;
	handleCloseDialog?: (event: React.MouseEvent<HTMLElement>) => void;
	title: string;
	backdropBlur?: string | number;
	borderRadius?: string | number;
	fullWidth?: boolean;
	maxWidth?: Breakpoint | false;
	width?: number;
	dialogTitleFontSize?: number;
	dialogTitleFontFamily?: string;
	dialogTitleHeight?: number
}

// Component for dialog with title and children (without padding)
const SimpleDialog = ({
	children,
	handleCloseDialog,
	openDialog,
	setOpenDialog,
	title,
	backdropBlur,
	borderRadius,
	fullWidth,
	maxWidth,
	width,
	dialogTitleFontSize,
	dialogTitleFontFamily,
	dialogTitleHeight,
}: Prop) => {
	return (
		<Dialog
			onClose={(event: React.MouseEvent<HTMLElement>) => {
				handleCloseDialog && handleCloseDialog(event);
				setOpenDialog(false);
			}}
			open={openDialog}
			BackdropProps={{
				sx: {
					backdropFilter: `blur(${backdropBlur}px)`,
				},
			}}
			sx={{
				"& .MuiPaper-root": { borderRadius: borderRadius, width: width },
			}}
			onClick={(event) => event.stopPropagation()}
			fullWidth={fullWidth}
			maxWidth={maxWidth}
		>
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0}}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.6 }}
				>
					<DialogTitle
						sx={{ textAlign: "center" }}
						fontSize={dialogTitleFontSize}
						fontFamily={dialogTitleFontFamily}
						height={dialogTitleHeight}
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
						{title}
					</DialogTitle>
					{children}
				</motion.div>
			</AnimatePresence>
		</Dialog>
	);
};

export default SimpleDialog;
