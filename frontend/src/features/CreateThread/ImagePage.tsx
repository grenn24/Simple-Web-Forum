import { TextField } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import FileInput from "../../components/FileInput";
import { useRef, useState } from "react";
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
	const [openImageDeletedSnackbar, setOpenImageDeletedSnackbar] =
		useState(false);
	const [imageDeleted, setImageDeleted] = useState<File>({} as File);
	const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const newImages = Array.from(event.target.files);
			newImages.forEach((image: File) => imagesSelected.push(image));
			setImagesSelected(imagesSelected);
			setOpenImageUploadedSnackbar(true);
		}
	};
	const fileInputRef = useRef<HTMLInputElement>(null);
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
				handleButtonClick={() => fileInputRef.current?.click()}
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
			<br />
			<br />
			<br />

			<UploadedImageList
				imagesSelected={imagesSelected}
				setImagesSelected={setImagesSelected}
				setImageDeleted={setImageDeleted}
				setOpenImageDeletedSnackbar={setOpenImageDeletedSnackbar}
			/>
			{/*Hidden file input*/}
			<FileInput
				type="file"
				onChange={handleUploadImage}
				ref={fileInputRef}
				accept="image/jpeg, image/png, image/gif"
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
			{/*Image Deleted Snackbar*/}
			<Snackbar
				openSnackbar={openImageDeletedSnackbar}
				setOpenSnackbar={setOpenImageDeletedSnackbar}
				message="Image deleted"
				duration={3000}
				undoButton
				handleUndoButtonClick={() =>
					setImagesSelected([...imagesSelected, imageDeleted])
				}
			/>
		</>
	);
};

export default ImagePage;
