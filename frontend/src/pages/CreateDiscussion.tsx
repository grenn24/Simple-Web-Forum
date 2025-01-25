import { Box, CircularProgress, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../utilities/redux";
import TabMenu from "../components/TabMenu";
import InfoPage from "../features/Discussions/CreateDiscussion/InfoPage";
import BackgroundPage from "../features/Discussions/CreateDiscussion/BackgroundPage";
import MemberPage from "../features/Discussions/CreateDiscussion/MemberPage";
import { postFormData } from "../utilities/api";
import { changeIsCompressingImage, reset } from "../features/Discussions/createDiscussionSlice";
import Snackbar from "../components/Snackbar";

const CreateDiscussion = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isUploading, setIsUploading] = useState(false);
	const [openDiscussionCreatedSnackbar, setOpenDiscussionCreatedSnackbar] = useState(false);
	
	const { name, description, backgroundImage,isCompressingImage } = useAppSelector((state) => ({
		name: state.createDiscussion.name,
		description: state.createDiscussion.description,
		backgroundImage: state.createDiscussion.backgroundImage,
		isCompressingImage: state.createDiscussion.isCompressingImage,
	}));

	const handleCreateDiscussion = () => {
		if (name !== "") {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("name", name);
			formData.append("description", description);
			backgroundImage && formData.append("background_image", backgroundImage);
			postFormData(
				"/discussions",
				formData,
				() => {dispatch(reset());
					setIsUploading(false);
					setOpenDiscussionCreatedSnackbar(true);
				},
				(err) => console.log(err)
			);
		}
	};

	useEffect(()=>{
		dispatch(changeIsCompressingImage(false));
		console.log(isCompressingImage)
	},[])
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
				Create Discussion
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
			</Box>
			<Container
				sx={{
					width: { xs: "100%", sm: 600, md: 650, lg: 650, xl: 650 },

					px: { xs: 1, sm: 3 },
				}}
				disableGutters
			>
				{" "}
				<TabMenu
					tabLabelArray={["Info", "Background", "Members"]}
					tabPageArray={[<InfoPage />, <BackgroundPage />, <MemberPage />]}
				/>
				<Box textAlign="right" marginTop={3}>
					<Button
						color="primary.dark"
						variant="outlined"
						fontSize={17}
						fontWeight={600}
						handleButtonClick={handleCreateDiscussion}
						loadingStatus={isUploading}
					>
						Create Discussion
					</Button>
				</Box>
			</Container>
			{/*Discussion Created snackbar*/}
			<Snackbar
				openSnackbar={openDiscussionCreatedSnackbar}
				setOpenSnackbar={setOpenDiscussionCreatedSnackbar}
				message="Discussion has been created"
				duration={2000}
				undoButton={false}
			/>
			{/*Image compressing snackbar*/}
			<Snackbar
				openSnackbar={isCompressingImage}
				message="Compressing Background Image"
				undoButton={false}
				actionIcon={<CircularProgress size={27} sx={{ marginRight: 1.5 }} />}
				closeButton={false}
			/>

		</Box>
	);
};

export default CreateDiscussion;
