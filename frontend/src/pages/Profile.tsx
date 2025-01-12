import {
	Box,
	Divider,
	Typography,
	Avatar,
	useTheme,
	Skeleton,
	Badge,
	TextField,
	InputAdornment,
	useMediaQuery,
} from "@mui/material";
import Button from "../components/Button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
	EditRounded as EditRoundedIcon,
	CheckRounded as CheckRoundedIcon,
	AttachFileRounded as AttachFileRoundedIcon,
	DeleteRounded as DeleteRoundedIcon,
	PhotoCameraRounded as PhotoCameraRoundedIcon,
} from "@mui/icons-material";
import TabMenu from "../components/TabMenu/TabMenu";
import profileTabMenuLabels from "../features/Profile/tabMenuLabels";
import profileTabMenuPages from "../features/Profile/tabMenuPages";
import { Delete, get, postJSON, putFormData } from "../utilities/api";
import { Controller, useForm } from "react-hook-form";
import { parseAuthor } from "../utilities/parseApiResponse";
import { AuthorDTO } from "../dtos/AuthorDTO";
import SimpleDialog from "../components/SimpleDialog";
import List from "../components/List";
import Snackbar from "../components/Snackbar";
import FileInput from "../components/FileInput";
import CameraInput from "../components/CameraInput";

const Profile = () => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
		setError,
		watch,
	} = useForm();
	const [searchParams, _] = useSearchParams();
	const type = searchParams.get("type");
	let currentTabIndex = 0;
	profileTabMenuLabels.forEach((label, index) => {
		if (label === type) {
			currentTabIndex = index;
		}
	});
	const navigate = useNavigate();
	const theme = useTheme();
	const [author, setAuthor] = useState<AuthorDTO>({} as AuthorDTO);
	const [followStatus, setFollowStatus] = useState(false);
	const { authorID } = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [openUploadAvatarDialog, setOpenUploadAvatarDialog] = useState(false);
	const [openFileSizeLimitSnackbar, setOpenFileSizeLimitSnackbar] =
		useState(false);
	const [openAvatarIconDeletedSnackbar, setOpenAvatarIconDeletedSnackbar] =
		useState(false);
	const [openAvatarIconUploadedSnackbar, setOpenAvatarIconUploadedSnackbar] =
		useState(false);
	const [
		openAvatarIconUploadErrorSnackbar,
		setOpenAvatarIconUploadErrorSnackbar,
	] = useState(false);

	const [openProfileEditErrorSnackbar, setOpenProfileEditErrorSnackbar] =
		useState(false);
	const [openFileInput, setOpenFileInput] = useState(false);
	const [openCameraInput, setOpenCameraInput] = useState(false);

	// Retrieve author information from api (re-fetch if a new edit is submitted or if the author path variable in url is changed)
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}`,
				(res) => {
					const responseBody = res.data.data;
					const author = parseAuthor(responseBody);
					setAuthor(author);
					setFollowStatus(author.followStatus);
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[authorID, isEditing, type]
	);

	const handleFollowAuthor = () => {
		if (followStatus) {
			setFollowStatus(false);
			Delete(
				"/follows/user",
				{
					followee_author_id: Number(authorID),
				},
				() => {},
				(err) => console.log(err)
			);
		} else {
			setFollowStatus(true);
			postJSON(
				"follows/user",
				{
					followee_author_id: Number(authorID),
				},
				() => {},
				(err) => console.log(err)
			);
		}
	};

	const handleEditButtonClick = handleSubmit((data) => {
		if (isEditing) {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("username", data.username);
			formData.append("biography", data.biography);
			putFormData(
				"/authors/user",
				formData,
				() => {
					setIsEditing(false);
					setIsUploading(false);
					reset();
				},
				(err) => {
					console.log(err);
					setIsUploading(false);
					const errBody = err.data;
					if (errBody.error_code === "NAME_ALREADY_EXISTS") {
						setError("name", {
							type: "custom",
							message: errBody.message,
						});
					}
					if (errBody.error_code === "USERNAME_ALREADY_EXISTS") {
						setError("username", {
							type: "custom",
							message: errBody.message,
						});
					}
					if (
						errBody.error_code !== "USERNAME_ALREADY_EXISTS" &&
						errBody.error_code !== "NAME_ALREADY_EXISTS"
					) {
						setOpenProfileEditErrorSnackbar(true);
					}
				}
			);
		} else {
			setIsEditing(true);
		}
	});

	const handleUploadAvatarIcon = (files: FileList) => {
		setOpenUploadAvatarDialog(false);
		const avatarIcon = files[0];
		if (avatarIcon.size > 20000000) {
			setOpenFileSizeLimitSnackbar(true);
		} else {
			const formData = new FormData();
			formData.append("avatar_icon", avatarIcon);
			putFormData(
				"/authors/user/avatar-icon-link",
				formData,
				() => setOpenAvatarIconUploadedSnackbar(true),
				(err) => {
					console.log(err);
					setOpenAvatarIconUploadErrorSnackbar(true);
				}
			);
		}
	};

	const handleDeleteAvatarIcon = () => {
		setOpenUploadAvatarDialog(false);
		setOpenAvatarIconDeletedSnackbar(true);
		setAuthor({ ...author, avatarIconLink: "" });
		Delete(
			"/authors/user/avatar-icon-link",
			{},
			() => {},
			(err) => console.log(err)
		);
	};

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			flexGrow={1}
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
				marginBottom={2}
				width="100%"
			>
				Profile
			</Typography>
			<Box width="100%">
				<Divider />
			</Box>

			<Box
				sx={{ marginTop: 2 }}
				width="100%"
				display="flex"
				justifyContent="space-between"
			>
				<Button
					buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
					color="primary.dark"
					buttonStyle={{ mx: 0, p: 0 }}
					handleButtonClick={() => navigate(-1)}
					toolTipText="Back"
				/>
			</Box>
			<Box
				sx={{
					width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
				}}
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Box
					width="100%"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Box display="flex" alignItems="center">
						<Badge
							overlap="circular"
							anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
							badgeContent={
								<Button
									variant="contained"
									backgroundColor="rgba(60, 60, 60, 0.95)"
									color="white"
									toolTipText="Change Avatar"
									buttonStyle={{
										display:
											authorID !== "User" || isLoading ? "none" : "inline-flex",
									}}
									buttonIcon={<EditRoundedIcon style={{ fontSize: 22 }} />}
									handleButtonClick={() => setOpenUploadAvatarDialog(true)}
								></Button>
							}
						>
							<Avatar
								src={author.avatarIconLink}
								sx={{ width: 90, height: 90 }}
							/>
						</Badge>
						<SimpleDialog
							openDialog={openUploadAvatarDialog}
							setOpenDialog={setOpenUploadAvatarDialog}
							title="Edit Avatar Icon"
							backdropBlur={5}
							borderRadius={1.3}
							width={400}
							handleCloseDialog={(event) => event.stopPropagation()}
							dialogTitleHeight={55}
						>
							<List
								divider
								listIconsArray={
									author.avatarIconLink
										? [
												<PhotoCameraRoundedIcon sx={{ marginRight: 1 }} />,
												<AttachFileRoundedIcon sx={{ marginRight: 1 }} />,
												<DeleteRoundedIcon sx={{ marginRight: 1 }} />,
												<></>,
										  ]
										: [
												<PhotoCameraRoundedIcon sx={{ marginRight: 1 }} />,
												<AttachFileRoundedIcon sx={{ marginRight: 1 }} />,
												<></>,
										  ]
								}
								listItemsArray={
									author.avatarIconLink
										? [
												"Take a Photo",
												"Upload from File",
												"Delete Avatar Icon",
												"Cancel",
										  ]
										: ["Take a Photo", "Upload from File", "Cancel"]
								}
								handleListItemsClick={
									author.avatarIconLink
										? [
												() => setOpenCameraInput(true),
												() => setOpenFileInput(true),
												handleDeleteAvatarIcon,
												() => setOpenUploadAvatarDialog(false),
										  ]
										: [
												() => setOpenCameraInput(true),
												() => setOpenFileInput(true),
												() => setOpenUploadAvatarDialog(false),
										  ]
								}
							/>
						</SimpleDialog>
						<Box
							height={130}
							display="flex"
							flexDirection="column"
							justifyContent="space-evenly"
							marginLeft={2}
						>
							<Typography fontSize={27} fontWeight={600}>
								{isLoading ? (
									<Skeleton
										variant="rounded"
										width={250}
										animation="pulse"
										height={20}
										sx={{ my: 1 }}
									/>
								) : isEditing ? (
									<Controller
										name="name"
										control={control}
										defaultValue={author.name}
										render={() => (
											<TextField
												label="Name"
												size="small"
												fullWidth
												{...register("name", {
													required: "Required",
												})}
												helperText={errors.name?.message as string}
												error={!!errors.name}
											/>
										)}
									/>
								) : (
									author.name
								)}
							</Typography>

							<Typography fontSize={16} fontWeight={300}>
								{isLoading ? (
									<Skeleton
										variant="rounded"
										width={150}
										animation="pulse"
										height={20}
										sx={{ my: 1 }}
									/>
								) : isEditing ? (
									<Controller
										name="username"
										control={control}
										defaultValue={author.username}
										render={() => (
											<TextField
												label="Username"
												size="small"
												slotProps={{
													input: {
														startAdornment: (
															<InputAdornment position="start">
																@
															</InputAdornment>
														),
													},
												}}
												fullWidth
												{...register("username", {
													required: "Required",
												})}
												helperText={errors.username?.message as string}
												error={!!errors.username}
											/>
										)}
									/>
								) : (
									`@${author.username}`
								)}
							</Typography>
						</Box>
					</Box>
					{!isLoading ? (
						!author.isUser ? (
							<Button
								buttonStyle={{ py: 0 }}
								borderRadius={40}
								fontSize={18}
								buttonIcon={
									followStatus ? (
										<NotificationsActiveRoundedIcon />
									) : (
										<NotificationsNoneRoundedIcon />
									)
								}
								handleButtonClick={handleFollowAuthor}
							>
								Follow
							</Button>
						) : (
							// Button for editing basic profile info
							<Button
								loadingStatus={isUploading}
								variant="contained"
								backgroundColor="rgba(69, 69, 69, 0.68)"
								buttonStyle={{ py: 0 }}
								borderRadius={40}
								fontSize={18}
								buttonIcon={
									isEditing ? <CheckRoundedIcon /> : <EditRoundedIcon />
								}
								type="submit"
								handleButtonClick={handleEditButtonClick}
							>
								{isEditing ? "Confirm" : "Edit"}
							</Button>
						)
					) : (
						<Skeleton
							variant="rounded"
							width={130}
							animation="pulse"
							height={20}
						/>
					)}
				</Box>
				<Box width="100%">
					<Divider />
				</Box>
				<Box my={2} width="100%">
					{isEditing ? (
						<>
							<Controller
								name="biography"
								control={control}
								defaultValue={author.biography}
								render={() => (
									<TextField
										label="Bio"
										size="small"
										fullWidth
										variant="outlined"
										{...register("biography", {
											validate: {
												validBio: (x) => /^.{0,149}$/.test(x),
											},
										})}
										error={!!errors.biography}
									/>
								)}
							/>
							<Typography
								fontSize={15}
								marginLeft={1}
								fontWeight={500}
								color={errors.biography ? "red" : "inherit"}
							>
								{watch("biography")?.length}/150 Characters
							</Typography>
						</>
					) : (
						<Typography
							textAlign="center"
							sx={{ borderColor: "red" }}
							whiteSpace="pre-wrap"
						>
							{author.biography}
						</Typography>
					)}
				</Box>

				<TabMenu
					tabLabelArray={profileTabMenuLabels}
					tabPageArray={profileTabMenuPages}
					variant={
						useMediaQuery(theme.breakpoints.up("sm"))
							? "fullWidth"
							: "scrollable"
					}
					defaultPageIndex={currentTabIndex}
					handleTabLabelClick={(newTabIndex) =>
						navigate("?type=" + profileTabMenuLabels[newTabIndex])
					}
				/>
			</Box>
			{/*Hidden avatar icon input components*/}
			<FileInput
				onFileSubmit={handleUploadAvatarIcon}
				openFileInput={openFileInput}
				setOpenFileInput={setOpenFileInput}
				acceptedFileTypes="image/jpeg, image/png, image/gif"
			/>
			<CameraInput
				onFileSubmit={handleUploadAvatarIcon}
				openCameraInput={openCameraInput}
				setOpenCameraInput={setOpenCameraInput}
				acceptedFileTypes="image/jpeg, image/png"
			/>
			{/*File Size Limit exceeded snackbar*/}
			<Snackbar
				openSnackbar={openFileSizeLimitSnackbar}
				setOpenSnackbar={setOpenFileSizeLimitSnackbar}
				message="File size exceeds 20mb limit"
				duration={2000}
				undoButton={false}
			/>
			{/*Avatar icon uploaded snackbar*/}
			<Snackbar
				openSnackbar={openAvatarIconUploadedSnackbar}
				setOpenSnackbar={setOpenAvatarIconUploadedSnackbar}
				message="Avatar icon uploaded successfully"
				duration={2000}
				undoButton={false}
			/>
			{/*Avatar icon upload error snackbar*/}
			<Snackbar
				openSnackbar={openAvatarIconUploadErrorSnackbar}
				setOpenSnackbar={setOpenAvatarIconUploadErrorSnackbar}
				message="An error occurred while uploading the avatar icon. Please try again."
				duration={2000}
				undoButton={false}
			/>
			{/*Avatar icon deleted snackbar*/}
			<Snackbar
				openSnackbar={openAvatarIconDeletedSnackbar}
				setOpenSnackbar={setOpenAvatarIconDeletedSnackbar}
				message="Avatar icon deleted"
				duration={2000}
				undoButton={false}
			/>
			{/*Profile edit error snackbar*/}
			<Snackbar
				openSnackbar={openProfileEditErrorSnackbar}
				setOpenSnackbar={setOpenProfileEditErrorSnackbar}
				message="An error occurred while updating your profile. Please try again."
				duration={2000}
				undoButton={false}
			/>
		
		</Box>
	);
};

export default Profile;
