import { Dialog, DialogTitle } from "@mui/material";

interface Prop {
	children?: React.ReactNode;
	openDialog: boolean;
	setOpenDialog: (state: boolean) => void;
	handleCloseDialog?: (event: React.MouseEvent<HTMLElement>) => void;
	title: string;
	backdropBlur?: string | number;
	borderRadius?: string | number;
}

const SimpleDialog = ({
	children,
	handleCloseDialog,
	openDialog,
	setOpenDialog,
	title,
	backdropBlur,
	borderRadius,
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
					backdropFilter: `blur(${backdropBlur}px)`, // Inline style using the `sx` prop
				},
			}}
			sx={{ "& .MuiPaper-root": { borderRadius: borderRadius } }}
		>
			<DialogTitle sx={{ paddingBottom: 0, textAlign: "center" }}>
				{title}
			</DialogTitle>
			{children}
		</Dialog>
	);
};

export default SimpleDialog;
