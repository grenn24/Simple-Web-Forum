import {
	Box,
	Typography,
	Divider,
	Container,
	CircularProgress,
	Stack,
} from "@mui/material";
import Button from "../components/Button";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import TabMenu from "../components/TabMenu";
import TextPage from "../features/CreateThread/TextPage";
import ImagePage from "../features/CreateThread/ImagePage";
import { useForm } from "react-hook-form";
import { get, postFormData } from "../utilities/api";
import { useEffect, useState } from "react";
import Snackbar from "../components/Snackbar";
import { createWebsocket } from "../utilities/websocket";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../utilities/redux";
import {
	editUpload,
	addUpload,
	deleteUpload,
	changeOpenImageUploadedSnackbar,
	changeOpenVideoUploadedSnackbar,
	resetFields,
	changeDiscussionID,
} from "../features/CreateThread/createThreadSlice";
import VideoPage from "../features/CreateThread/VideoPage";
import { convertToRaw } from "draft-js";
import { DiscussionDTO } from "../dtos/DiscussionDTO";
import { parseDiscussions } from "../utilities/parseApiResponse";
import Select from "../components/Select";

const CreateThread = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [isUploading, setIsUploading] = useState(false);
	const [discussionsJoined, setDiscussionsJoined] = useState<DiscussionDTO[]>(
		[]
	);
	const [selectItemIndex, setSelectItemIndex] = useState(-1);
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
	} = useForm({
		mode: "onChange",
	});
	const dispatch = useAppDispatch();
	const {
		isCompressingImages,
		openImageUploadedSnackbar,
		openVideoUploadedSnackbar,
		imagesSelected,
		videosSelected,
		topicsSelected,
		content,
		discussionID,
	} = useAppSelector((state) => ({
		uploads: state.createThread.uploads,
		isCompressingImages: state.createThread.isCompressingImages,
		openImageUploadedSnackbar: state.createThread.openImageUploadedSnackbar,
		openVideoUploadedSnackbar: state.createThread.openVideoUploadedSnackbar,
		imagesSelected: state.createThread.imagesSelected,
		videosSelected: state.createThread.videosSelected,
		topicsSelected: state.createThread.topicsSelected,
		content: state.createThread.content,
		discussionID: state.createThread.discussionID,
	}));

	useEffect(() => {
		get(
			"/authors/user/discussions/joined",
			(res) => {
				const responseBody = res.data.data;
				const discussionsJoined = parseDiscussions(responseBody);
				console.log(discussionID);
				setDiscussionsJoined(discussionsJoined);
				if (location.state) {
					
					dispatch(changeDiscussionID(Number(location.state?.discussionID)));
					setSelectItemIndex(
						discussionsJoined.findIndex(
							(discussion) =>
								discussion.discussionID === Number(location.state?.discussionID)
						) + 1
					);
				} else {
					setSelectItemIndex(
						discussionID
							? discussionsJoined.findIndex(
									(discussion) => discussion.discussionID === discussionID
							  ) + 1
							: 0
					);
				}
			},
			(err) => console.log(err)
		);
	}, [location.state]);

	const createThread = handleSubmit((data) => {
		const uploadID = uuidv4();
		if (watch("title") === "" || isCompressingImages) {
			setOpenThreadTitleMissingSnackbar(true);
			return;
		}
		if (discussionID === 0) {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("upload_id", uploadID);
			formData.append("title", data.title);
			formData.append(
				"content",
				JSON.stringify(convertToRaw(content.getCurrentContent()))
			);
			imagesSelected.forEach((image: File) => formData.append("images", image));
			videosSelected.forEach((video: File) => formData.append("videos", video));
			topicsSelected.forEach((topic) =>
				formData.append("topics_tagged", topic)
			);
			postFormData(
				"/threads",
				formData,
				() => {
					dispatch(resetFields());
					reset();
					setValue("title", "");
					setIsUploading(false);
					setOpenThreadUploadStartedSnackbar(true);
					const websocket = createWebsocket("/threads/upload-progress");

					websocket.onopen = () => {
						websocket.send(
							JSON.stringify({
								upload_id: uploadID,
							})
						);
						dispatch(
							addUpload({
								uploadID: uploadID,
								title: data.title,
								uploadStatus: "incomplete",
								progress: 0,
							})
						);
					};
					websocket.onmessage = (event) => {
						const upload = JSON.parse(event.data);
						if (upload.status === "incomplete") {
							dispatch(
								editUpload({
									uploadID: uploadID,
									title: data.title,
									uploadStatus: upload.status,
									progress: upload.progress,
								})
							);
						}
						if (upload.status === "complete") {
							dispatch(
								editUpload({
									uploadID: uploadID,
									title: data.title,
									uploadStatus: upload.status,
									progress: upload.progress,
								})
							);
						}
						if (upload.status === "error") {
							dispatch(
								editUpload({
									uploadID: uploadID,
									title: data.title,
									uploadStatus: upload.status,
								})
							);
						}
					};
					websocket.onclose = () => {
						websocket.close();
						setTimeout(() => dispatch(deleteUpload(uploadID)), 2000);
					};
				},
				(err) => {
					console.log(err);
					setOpenThreadUploadErrorSnackbar(true);
					setIsUploading(false);
				}
			);
		} else {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("upload_id", uploadID);
			formData.append("title", data.title);
			formData.append(
				"content",
				JSON.stringify(convertToRaw(content.getCurrentContent()))
			);
			imagesSelected.forEach((image: File) => formData.append("images", image));
			videosSelected.forEach((video: File) => formData.append("videos", video));
			postFormData(
				`/discussions/${discussionID}/threads`,
				formData,
				() => {
					dispatch(resetFields());
					reset();
					setValue("title", "");
					setIsUploading(false);
					setOpenThreadUploadStartedSnackbar(true);
					const websocket = createWebsocket("/threads/upload-progress");

					websocket.onopen = () => {
						websocket.send(
							JSON.stringify({
								upload_id: uploadID,
							})
						);
						dispatch(
							addUpload({
								uploadID: uploadID,
								title: data.title,
								uploadStatus: "incomplete",
								progress: 0,
							})
						);
					};
					websocket.onmessage = (event) => {
						const upload = JSON.parse(event.data);
						if (upload.status === "incomplete") {
							dispatch(
								editUpload({
									uploadID: uploadID,
									title: data.title,
									uploadStatus: upload.status,
									progress: upload.progress,
								})
							);
						}
						if (upload.status === "complete") {
							dispatch(
								editUpload({
									uploadID: uploadID,
									title: data.title,
									uploadStatus: upload.status,
									progress: upload.progress,
								})
							);
						}
						if (upload.status === "error") {
							dispatch(
								editUpload({
									uploadID: uploadID,
									title: data.title,
									uploadStatus: upload.status,
								})
							);
						}
					};
					websocket.onclose = () => {
						websocket.close();
						setTimeout(() => dispatch(deleteUpload(uploadID)), 2000);
					};
				},
				(err) => {
					console.log(err);
					setOpenThreadUploadErrorSnackbar(true);
					setIsUploading(false);
				}
			);
		}
	});

	useEffect(() => {
		window.addEventListener("beforeunload", (event) => event.preventDefault());
		return window.removeEventListener("beforeunload", (event) =>
			event.preventDefault()
		);
	}, []);

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
				color="text.primary"
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
					color="text.primary"
					buttonStyle={{ mx: 0, p: 0 }}
					handleButtonClick={() => navigate(-1)}
				/>

				<Select
					selectItemsArray={[
						"Public",
						...discussionsJoined?.map((discussion) => discussion.name),
					]}
					handleSelect={(index) => {
						setSelectItemIndex(index);
						if (index) {
							dispatch(
								changeDiscussionID(discussionsJoined[index - 1].discussionID)
							);
						} else {
							dispatch(changeDiscussionID(0));
						}
					}}
					label="Discussion"
					size="medium"
					style={{
						width: 250,
						height: 50,
						background: "rgb(220,220,220,1)",
						border: 0,
					}}
					showEmptyItem={false}
					currentItemIndex={selectItemIndex}
				/>
			</Box>
			<Container
				sx={{
					width: { xs: "100%", sm: 600, md: 650, lg: 650, xl: 650 },

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
							isUploading={isUploading}
							watch={watch}
						/>,
						<ImagePage />,
						<VideoPage />,
					]}
				/>
				<Box textAlign="right" marginTop={3}>
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
			<Stack>
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
					message="An error occurred while uploading the thread. Please try again."
					duration={3000}
					undoButton={false}
				/>
				{/*Thread missing snackbar*/}
				<Snackbar
					openSnackbar={openThreadTitleMissingSnackbar}
					setOpenSnackbar={setOpenThreadTitleMissingSnackbar}
					message="Please add a title for your thread before uploading."
					duration={3000}
					undoButton={false}
				/>
				{/*Image compressing snackbar*/}
				<Snackbar
					openSnackbar={isCompressingImages}
					
					message="Compressing Images"
					undoButton={false}
					actionIcon={<CircularProgress size={27} sx={{ marginRight: 1.5 }} />}
					closeButton={false}
				/>
				{/*Image uploaded snackbar*/}
				<Snackbar
					openSnackbar={openImageUploadedSnackbar}
					handleSnackbarClose={() =>
						dispatch(changeOpenImageUploadedSnackbar(false))
					}
					message="Images Uploaded"
					duration={2000}
					undoButton={false}
				/>
				{/*Video uploaded snackbar*/}
				<Snackbar
					openSnackbar={openVideoUploadedSnackbar}
					handleSnackbarClose={() =>
						dispatch(changeOpenVideoUploadedSnackbar(false))
					}
					message="Videos Uploaded"
					duration={2000}
					undoButton={false}
				/>
			</Stack>
		</Box>
	);
};

export default CreateThread;
