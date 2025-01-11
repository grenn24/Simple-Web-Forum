import { Box, Typography, Divider, Container } from "@mui/material";
import Button from "../components/Button";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TabMenu from "../components/TabMenu";
import TextPage from "../features/CreateThread/TextPage";
import ImagePage from "../features/CreateThread/ImagePage";
import { useForm } from "react-hook-form";
import { postFormData } from "../utilities/api";
import { useState } from "react";
import Snackbar from "../components/Snackbar";
import LinearProgressWithLabel from "../components/LinearProgressWithLabel/LinearProgressWithLabel";
import { closeWebsocket, createWebsocket } from "../utilities/websocket";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../utilities/reduxHooks";
import {
	changeUploadID,
	changeProgress,
	changeUploadStatus,
	reset as resetSlice
} from "../features/CreateThread/createThreadSlice";

const CreateThread = () => {
	const navigate = useNavigate();
	const [topicsSelected, setTopicsSelected] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [imagesSelected, setImagesSelected] = useState<File[]>([]);

	const [openThreadUploadStartedSnackbar, setOpenThreadUploadStartedSnackbar] =
		useState(false);
	const [openThreadUploadErrorSnackbar, setOpenThreadUploadErrorSnackbar] =
		useState(false);
	const [openThreadTitleMissingSnackbar, setOpenThreadTitleMissingSnackbar] =
		useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
		setValue,
		watch,
	} = useForm();
	const dispatch = useAppDispatch();

	const createThread = handleSubmit((data) => {
		const uploadID = uuidv4();
		if (watch("title") !== "") {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("upload_id", uploadID);
			formData.append("title", data.title);
			formData.append("content", data.content);
			formData.append("image_title", data.imageTitle);
			imagesSelected.forEach((image: File) => formData.append("images", image));
			topicsSelected.forEach((topic) =>
				formData.append("topics_tagged", topic)
			);
			postFormData(
				"/threads/user",
				formData,
				() => {
					reset();
					setValue("title", "");
					setValue("content", "");
					setImagesSelected([]);
					setTopicsSelected([]);
					setIsUploading(false);
					setOpenThreadUploadStartedSnackbar(true);
					const websocket = createWebsocket("/threads/upload-progress");
					websocket.onopen = () => {
						websocket.send(
							JSON.stringify({
								upload_id: uploadID,
							})
						);
						dispatch(changeUploadStatus(true));
					};

					websocket.onmessage = (event) => {
						console.log(event);
						const upload = JSON.parse(event.data);
						if (upload.status === "INCOMPLETE") {
							dispatch(changeProgress(upload.progress));
						}
						if (upload.status === "COMPLETE") {
							dispatch(changeProgress(upload.progress));
						}
					};

					websocket.onclose = () => {
						websocket.close();
						dispatch(changeUploadStatus(false));
						dispatch(resetSlice());
					}
				},
				(err) => {
					console.log(err);
					setOpenThreadUploadErrorSnackbar(true);
					setIsUploading(false);
				}
			);
		} else {
			setOpenThreadTitleMissingSnackbar(true);
		}
	});

	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Typography
				textAlign={"left"}
				fontFamily="Open Sans"
				fontWeight={700}
				fontSize={30}
				color="primary.dark"
				width="100%"
				marginBottom={2}
			>
				Create Thread
			</Typography>

			<Box width="100%">
				<Divider />
			</Box>
			<Box
				marginTop={2}
				width="100%"
				display="flex"
				justifyContent="space-between"
			>
				<Button
					buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
					color="primary.dark"
					buttonStyle={{ mx: 0, p: 0 }}
					handleButtonClick={() => navigate(-1)}
				/>
			</Box>
			<Container
				sx={{
					width: { xs: "100%", sm: 600, md: 650, lg: 650, xl: 650 },
					my: 3,
					px: { xs: 1, sm: 3 },
				}}
				disableGutters
			>
				<TabMenu
					tabLabelArray={["Text", "Image", "Video"]}
					tabPageArray={[
						<TextPage
							register={register}
							createThread={createThread}
							errors={errors}
							control={control}
							topicsSelected={topicsSelected}
							setTopicsSelected={setTopicsSelected}
							isUploading={isUploading}
						/>,
						<ImagePage
							imagesSelected={imagesSelected}
							setImagesSelected={setImagesSelected}
							register={register}
							control={control}
						/>,
					]}
				/>
				<Box textAlign="right">
					<Button
						color="primary.dark"
						variant="outlined"
						fontSize={17}
						fontWeight={600}
						handleButtonClick={createThread}
						loadingStatus={isUploading}
					>
						Upload Thread
					</Button>
				</Box>
			</Container>
			

			{/*Thread Upload Started snackbar*/}
			<Snackbar
				openSnackbar={openThreadUploadStartedSnackbar}
				setOpenSnackbar={setOpenThreadUploadStartedSnackbar}
				message="Thread will be uploaded in the background"
				duration={1000}
				undoButton={false}
			/>
			{/*Thread Upload error snackbar*/}
			<Snackbar
				openSnackbar={openThreadUploadErrorSnackbar}
				setOpenSnackbar={setOpenThreadUploadErrorSnackbar}
				message="An error occurred while Uploading the thread. Please try again."
				duration={3000}
				undoButton={false}
			/>
			{/*Thread missing snackbar*/}
			<Snackbar
				openSnackbar={openThreadTitleMissingSnackbar}
				setOpenSnackbar={setOpenThreadTitleMissingSnackbar}
				message="Please add a title for your thread before Uploading."
				duration={3000}
				undoButton={false}
			/>
		</Box>
	);
};

export default CreateThread;
