import { Box, Divider, Link, Typography } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Button from "../../components/Button";
import { removeFromArray } from "../../utilities/arrayManipulation";
import { openFileInNewWindow } from "../../utilities/fileManipulation";
import Snackbar from "../../components/Snackbar";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../../utilities/redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

interface Prop {
	filesSelected: File[];
	setFilesSelected: ActionCreatorWithPayload<any>;
}

const UploadedFilesList = ({ filesSelected, setFilesSelected }: Prop) => {
	const dispatch = useAppDispatch();
	const files = Array.from(filesSelected).map((file: File) => file);
	const [fileDeleted, setfileDeleted] = useState<File>({} as File);
	const [openFileDeletedSnackbar, setOpenfileDeletedSnackbar] =
		useState(false);

		useEffect(()=>console.log(openFileDeletedSnackbar),[]);
	return (
		files.length !== 0 && (
			<>
				<Box
					width="100%"
					display="flex"
					justifyContent="space-between"
					marginTop={3}
				>
					<Typography fontFamily="Open Sans" color="text.primary">
						{files.length} files
					</Typography>
					<Button
						buttonStyle={{ py: 0 }}
						handleButtonClick={() => dispatch(setFilesSelected([]))}
					>
						Clear All
					</Button>
				</Box>

				<Divider sx={{ my: 1.2 }} />
				{files.map((file, index) => (
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
						key={index}
					>
						<Link
							onClick={() => openFileInNewWindow(file)}
							underline="hover"
							rel="noreferrer"
							target="_blank"
							sx={{
								"&:hover": {
									cursor: "pointer",
								},
							}}
						>
							<Typography
								fontFamily="Open Sans"
								color="text.primary"
								fontSize={15}
							>
								{file.name}
							</Typography>
						</Link>
						<Box
							display="flex"
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								fontFamily="Open Sans"
								color="text.primary"
								fontSize={15}
							>
								{Math.round((file.size / Math.pow(2, 20)) * 100) / 100}mb
							</Typography>
							<Button
								buttonIcon={<ClearRoundedIcon />}
								color="primary.dark"
								buttonStyle={{ marginLeft: 1, p: 0 }}
								handleButtonClick={() => {
									dispatch(
										setFilesSelected(removeFromArray(filesSelected, index))
									);
									setfileDeleted(file);
									setOpenfileDeletedSnackbar(true);
								}}
							/>
						</Box>
					</Box>
				))}
				{/*File Deleted Snackbar*/}
				<Snackbar
					openSnackbar={openFileDeletedSnackbar}
					setOpenSnackbar={setOpenfileDeletedSnackbar}
					message="File deleted"
					duration={3000}
					undoButton
					handleUndoButtonClick={() =>
						dispatch(setFilesSelected([...filesSelected, fileDeleted]))
					}
				/>
			</>
		)
	);
};

export default UploadedFilesList;
