import { Dialog, DialogTitle} from "@mui/material";

interface Prop {
	children?: React.ReactNode;
	openDialog: boolean;
	setOpenDialog: (state: boolean) => void;
	handleCloseDialog?: (event: React.MouseEvent<HTMLElement>) => void;
	title: string;
	backdropBlur?: string | number;
	borderRadius?: string | number;
	fullWidth?: boolean;
	width?: number;
	dialogTitleFontSize?: number;
	dialogTitleFontFamily?: string;
	dialogTitleHeight?: number
}

const SimpleDialog = ({
	children,
	handleCloseDialog,
	openDialog,
	setOpenDialog,
	title,
	backdropBlur,
	borderRadius,
	fullWidth,
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
					backdropFilter: `blur(${backdropBlur}px)`
				},
			}}
			sx={{ "& .MuiPaper-root": { borderRadius: borderRadius, width: width } }}
			onClick={(event)=>event.stopPropagation()}
			fullWidth = {fullWidth}
			
		>
			<DialogTitle sx={{ textAlign: "center" }} fontSize={dialogTitleFontSize} fontFamily={dialogTitleFontFamily} height={dialogTitleHeight} display="flex" justifyContent="center" alignItems="center">
				{title}
			</DialogTitle>
			{children}
		</Dialog>
	);
};

export default SimpleDialog;
