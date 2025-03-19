import { Typography } from "@mui/material";
import FileInput from "../../components/FileInput";
import { useState } from "react";
import Button from "../../components/Button";
import Snackbar from "../../components/Snackbar";
import UploadedImagesList from "./UploadedFilesList";
import { compressImageFiles } from "../../utilities/fileManipulation";
import { useAppDispatch, useAppSelector } from "../../utilities/redux";
import {
	addImage,
	changeImagesSelected,
	changeIsCompressingImages,
	changeOpenImageUploadedSnackbar,
} from "./createThreadSlice";

const ImagePage = () => {
	const { imagesSelected } = useAppSelector((state) => ({
		imagesSelected: state.createThread.imagesSelected,
	}));
	const dispatch = useAppDispatch();
	const [openFileInput, setOpenFileInput] = useState(false);

	const [openImageLimitSnackbar, setOpenImageLimitSnackbar] = useState(false);

	const handleUploadImages = (files: FileList) => {
		dispatch(changeIsCompressingImages(true));
		const newImages = Array.from(files);
		compressImageFiles(newImages, 1)
			.then((compressedImages) => {
				let counter = 0;
				for (const compressedImage of compressedImages) {
					if (counter < 30) {
						dispatch(addImage(compressedImage));
						counter++;
					} else {
						setOpenImageLimitSnackbar(true);
						break;
					}
				}
				dispatch(changeIsCompressingImages(false));
				setTimeout(() => dispatch(changeOpenImageUploadedSnackbar(true)), 2000);
			})
			.catch((err) => console.log(err));
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
				Upload Image
			</Button>

			<Typography
				fontSize={15}
				marginLeft={1}
				fontWeight={500}
				color="primary.dark"
			>
				{imagesSelected.length}/30 Images
			</Typography>

			<UploadedImagesList
				filesSelected={imagesSelected}
				setFilesSelected={changeImagesSelected}
			/>
			{/*Hidden file input*/}
			<FileInput
				onFileSubmit={handleUploadImages}
				openFileInput={openFileInput}
				setOpenFileInput={setOpenFileInput}
				acceptedFileTypes="image/jpeg, image/png, image/gif"
				multiple
			/>

			{/*Image Number Limit Snackbar*/}
			<Snackbar
				openSnackbar={openImageLimitSnackbar}
				setOpenSnackbar={setOpenImageLimitSnackbar}
				message="A maximum of 30 images can be attached"
				duration={3000}
			/>
		</>
	);
};

export default ImagePage;
