import { TextField, Typography } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import FileInput from "../../components/FileInput";
import { useState } from "react";
import Button from "../../components/Button";
import Snackbar from "../../components/Snackbar";
import UploadedImageList from "./UploadedImageList";

interface Prop {
	register: (name: string, options?: object) => object;
	control: Control;
	imagesSelected: File[];
	setImagesSelected: (images: File[]) => void;
}

const ImagePage = ({ imagesSelected, setImagesSelected, control }: Prop) => {
	const [openImageUploadedSnackbar, setOpenImageUploadedSnackbar] =
		useState(false);

	const [openImageLimitSnackbar, setOpenImageLimitSnackbar] = useState(false);

	const handleUploadImage = (files: FileList) => {
		const newImages = Array.from(files);
		newImages.forEach((image: File) =>
			imagesSelected.length < 30
				? imagesSelected.push(image)
				: setOpenImageLimitSnackbar(true)
		);
		setImagesSelected(imagesSelected);
		setOpenImageUploadedSnackbar(true);
	};
	const [openFileInput, setOpenFileInput] = useState(false);
	return (
		<>
			<Controller
				name="imageTitle"
				control={control}
				defaultValue=""
				render={() => (
					<TextField
						label="Image Title"
						variant="outlined"
						autoComplete="off"
						fullWidth
					/>
				)}
			/>

			<br />
			<br />
			<br />
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
				{imagesSelected.length}/30 Images Attached
			</Typography>

			<br />
			<br />

			<UploadedImageList
				imagesSelected={imagesSelected}
				setImagesSelected={setImagesSelected}
			/>
			{/*Hidden file input*/}
			<FileInput
				onFileSubmit={handleUploadImage}
				openFileInput={openFileInput}
				setOpenFileInput={setOpenFileInput}
				acceptedFileTypes="image/jpeg, image/png, image/gif"
				multiple
			/>
			{/*Image uploaded snackbar*/}
			<Snackbar
				openSnackbar={openImageUploadedSnackbar}
				setOpenSnackbar={setOpenImageUploadedSnackbar}
				message="Image Uploaded"
				duration={2000}
				undoButton={false}
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
