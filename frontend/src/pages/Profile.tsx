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
	styled,
} from "@mui/material";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
	EditRounded as EditRoundedIcon,
	CheckRounded as CheckRoundedIcon,
	FileUploadRounded as FileUploadRoundedIcon,
	DeleteRounded as DeleteRoundedIcon,
} from "@mui/icons-material";
import TabMenu from "../components/TabMenu/TabMenu";
import profileTabMenuLabels from "../features/Profile/profileTabMenuLabels";
import profileTabMenuPages from "../features/Profile/profileTabMenuPages";
import { get, putFormData, putJSON } from "../utilities/apiClient";
import { Controller, useForm } from "react-hook-form";
import { parseAuthor } from "../utilities/parseApiResponse";
import { AuthorDTO } from "../dtos/AuthorDTO";
import SimpleDialog from "../components/SimpleDialog";
import List from "../components/List";
import Snackbar from "../components/Snackbar";

const FileInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

const Profile = () => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
		setError,
	} = useForm();
	const navigate = useNavigate();
	const theme = useTheme();
	const [followStatus, setFollowStatus] = useState(false);
	const { authorID } = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [openUploadAvatarDialog, setOpenUploadAvatarDialog] = useState(false);
	const [openFileSizeLimitSnackbar, setOpenFileSizeLimitSnackbar] =
		useState(false);
	const [author, setAuthor] = useState<AuthorDTO>({} as AuthorDTO);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Retrieve author information from api (re-fetch if a new edit is submitted or if the author path variable in url is changed)
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}`,
				(res) => {
					const responseBody = res.data.data;
					setAuthor(parseAuthor(responseBody));
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[authorID, isEditing]
	);

	const handleEditProfileClick = handleSubmit((data) => {
		if (isEditing) {
			setIsUploading(true);
			putJSON(
				"/authors/user",
				{ name: data.name, username: data.username },
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
				}
			);
		} else {
			setIsEditing(true);
		}
	});

	const handleUploadAvatarIcon = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files) {
			setOpenUploadAvatarDialog(false);
			const avatarIcon = event.target.files[0];
			if (avatarIcon.size > 20000000) {
				setOpenFileSizeLimitSnackbar(true);
			} else {
				const formData = new FormData();
				formData.append("avatar_icon", avatarIcon);
				putFormData(
					"/authors/user/avatar-icon-link",
					formData,
					() => {},
					(err) => console.log(err)
				);
			}
		}
	};

	const handleDeleteAvatarIcon = () =>
		{setOpenUploadAvatarDialog(false);
			putJSON(
			"/authors/user/avatar-icon-link",
			{},
			() => {},
			(err) => console.log(err)
		);}

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
										display: authorID !== "User" ? "none" : "static",
									}}
									handleButtonClick={() => setOpenUploadAvatarDialog(true)}
								>
									<EditRoundedIcon style={{ fontSize: 22 }} />
								</Button>
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
								listIconsArray={[
									<FileUploadRoundedIcon sx={{ marginRight: 1 }} />,
									<DeleteRoundedIcon sx={{ marginRight: 1 }} />,
									<></>,
								]}
								listItemsArray={[
									"Upload from File",
									"Delete Avatar Icon",
									"Cancel",
								]}
								handleListItemsClick={[
									() => fileInputRef.current?.click(),
									handleDeleteAvatarIcon,
									() => setOpenUploadAvatarDialog(false),
								]}
							/>
						</SimpleDialog>
						<Box
							height={130}
							display="flex"
							flexDirection="column"
							justifyContent="space-evenly"
							marginLeft={2}
						>
							<Typography fontSize={28} fontWeight={600}>
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

							<Typography fontSize={18} fontWeight={300}>
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
								fontSize={20}
								buttonIcon={
									followStatus ? (
										<NotificationsActiveRoundedIcon />
									) : (
										<NotificationsNoneRoundedIcon />
									)
								}
								handleButtonClick={() => setFollowStatus(!followStatus)}
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
								fontSize={20}
								buttonIcon={
									isEditing ? <CheckRoundedIcon /> : <EditRoundedIcon />
								}
								type="submit"
								handleButtonClick={handleEditProfileClick}
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
				<TabMenu
					tabLabelArray={profileTabMenuLabels}
					tabPageArray={profileTabMenuPages}
					variant={
						useMediaQuery(theme.breakpoints.up("sm"))
							? "fullWidth"
							: "scrollable"
					}
				/>
			</Box>
			{/*Hidden file input*/}
			<FileInput
				type="file"
				onChange={handleUploadAvatarIcon}
				ref={fileInputRef}
				accept="image/jpeg, image/png, image/gif"
			/>
			<Snackbar
				openSnackbar={openFileSizeLimitSnackbar}
				setOpenSnackbar={setOpenFileSizeLimitSnackbar}
				message="File size exceeds 20mb limit"
				duration={1000}
			/>
		</Box>
	);
};

export default Profile;
