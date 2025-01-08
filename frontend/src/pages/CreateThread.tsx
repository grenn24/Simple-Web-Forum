import { Box, Typography, Divider, Container } from "@mui/material";
import Button from "../components/Button";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TabMenu from "../components/TabMenu";
import TextPage from "../features/CreateThread/TextPage";
import ImagePage from "../features/CreateThread/ImagePage";
import { useForm } from "react-hook-form";
import { postFormData } from "../utilities/apiClient";
import { useState } from "react";
import Snackbar from "../components/Snackbar";

const CreateThread = () => {
	const navigate = useNavigate();
	const [topicsSelected, setTopicsSelected] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [imagesSelected, setImagesSelected] = useState<File[]>([]);
	const [openThreadPostedSnackbar, setOpenThreadPostedSnackbar] =
		useState(false);
	const [openThreadPostErrorSnackbar, setOpenThreadPostErrorSnackbar] =
		useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
		setValue,
	} = useForm();

	const createThread = handleSubmit((data) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", data.content);
		formData.append("image_title", data.imageTitle);
		imagesSelected.forEach((image: File) => formData.append("images", image));
		topicsSelected.forEach((topic) => formData.append("topics_tagged", topic));
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
				setOpenThreadPostedSnackbar(true);
			},
			(err) => {
				console.log(err);
				setOpenThreadPostErrorSnackbar(true);
			}
		);
		
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
			</Container>

			{/*Thread posted snackbar*/}
			<Snackbar
				openSnackbar={openThreadPostedSnackbar}
				setOpenSnackbar={setOpenThreadPostedSnackbar}
				message="Thread has been posted successfully"
				duration={2000}
				undoButton={false}
			/>
			{/*Thread post error snackbar*/}
			<Snackbar
				openSnackbar={openThreadPostErrorSnackbar}
				setOpenSnackbar={setOpenThreadPostErrorSnackbar}
				message="An error has occured while posting the thread. Please try again in a moment"
				duration={3000}
				undoButton={false}
			/>
		</Box>
	);
};

export default CreateThread;
