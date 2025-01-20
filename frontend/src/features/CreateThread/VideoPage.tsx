import { Typography } from "@mui/material";
import { useState } from "react";
import Button from "../../components/Button";
import FileInput from "../../components/FileInput";
import UploadedVideosList from "./UploadedFilesList";
import Snackbar from "../../components/Snackbar";
import { useAppDispatch, useAppSelector } from "../../utilities/redux";
import { addVideo, changeOpenVideoUploadedSnackbar, changeVideosSelected } from "./createThreadSlice";


const VideoPage = () => {
	const [openFileInput, setOpenFileInput] = useState(false);
	const [openVideoUploadedSnackbar, setOpenVideoUploadedSnackbar] =
		useState(false);
	const dispatch = useAppDispatch();
	const { videosSelected } = useAppSelector((state) => ({
			videosSelected: state.createThread.videosSelected,
		}));
	const handleUploadVideo = (files: FileList) => {
		dispatch(addVideo(files[0]));
		dispatch(changeOpenVideoUploadedSnackbar(true));
	};
	return (
		<>
			<Button
				variant="outlined"
				handleButtonClick={() => setOpenFileInput(true)}
				fontSize={18}
				color="primary.dark"
				buttonStyle={{
					width: "100%",
					height: 55,
					justifyContent: "flex-start",
				}}
			>
				Upload Video
			</Button>
			<Typography
				fontSize={15}
				marginLeft={1}
				fontWeight={500}
				color="primary.dark"
			>
				{videosSelected.length}/1 Videos
			</Typography>
			<UploadedVideosList
				filesSelected={videosSelected}
				setFilesSelected={changeVideosSelected}
			/>
			{/*Video uploaded snackbar*/}
			<Snackbar
				openSnackbar={openVideoUploadedSnackbar}
				setOpenSnackbar={setOpenVideoUploadedSnackbar}
				message="Videos Uploaded"
				duration={2000}
				undoButton={false}
			/>
			{/*Hidden file input*/}
			<FileInput
				onFileSubmit={handleUploadVideo}
				openFileInput={openFileInput}
				setOpenFileInput={setOpenFileInput}
				acceptedFileTypes="video/mp4,video/x-m4v,video/*"
			/>
		</>
	);
};

export default VideoPage;
