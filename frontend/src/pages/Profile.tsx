import {
	Box,
	Container,
	Divider,
	Typography,
	Avatar,
	useTheme,
	useMediaQuery,
	Skeleton,
	Badge,
	TextField,
	InputAdornment
} from "@mui/material";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
	EditRounded as EditRoundedIcon,
	CheckRounded as CheckRoundedIcon,
} from "@mui/icons-material";
import TabMenu from "../components/TabMenu/TabMenu";
import profileTabMenuLabels from "../features/Profile/profileTabMenuLabels";
import profileTabMenuPages from "../features/Profile/profileTabMenuPages";
import { get, putJSON } from "../utilities/apiClient";
import { Controller, useForm } from "react-hook-form";

const Profile = () => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
		setError
	} = useForm();
	const navigate = useNavigate();
	const theme = useTheme();
	const [followStatus, setFollowStatus] = useState(false);
	const { authorID } = useParams();
	const [isUser, setIsUser] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [author, setAuthor] = useState({
		authorID: 0,
		name: "",
		username: "",
		email: "",
		passwordHash: "",
		avatarIconLink: "",
		createdAt: new Date(),
		isUser: false,
	});
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}`,
				(res) => {
					const responseBody = res.data.data;
					const author = {
						authorID: responseBody.author_id,
						name: responseBody.name,
						username: responseBody.username,
						email: responseBody.email,
						passwordHash: responseBody.password_hash,
						avatarIconLink: responseBody.avatar_icon_link,
						createdAt: new Date(responseBody.created_at),
						isUser: responseBody.is_user,
					};
					setAuthor(author);
					setIsUser(author.isUser);
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[authorID, editMode]
	);

	const handleEditProfileClick = handleSubmit((data) => {
		if (editMode) {
			putJSON(
				"/authors/user",
				{ name: data.name, username: data.username },
				() => {
					setEditMode(false);
					reset();
				},
				(err) => {
					console.log(err);
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
			 setEditMode(true);
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
		>
			<Box
				sx={{
					marginBottom: 2,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignContent: "center",
				}}
			>
				<Typography
					textAlign={"left"}
					fontFamily="Open Sans"
					fontWeight={700}
					fontSize={30}
					color="primary.dark"
				>
					Profile
				</Typography>
			</Box>
			<Divider />
			<Box marginTop={2}>
				<Button
					buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
					color="primary.dark"
					buttonStyle={{ mx: 0, p: 0.5 }}
					handleButtonClick={() => navigate(-1)}
					toolTipText="Back"
				/>
			</Box>
			<Container
				sx={{
					width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
					
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
				disableGutters
			>
				<Box display="flex" width="100%" alignItems="center" marginBottom={2}>
					<Badge
						overlap="circular"
						anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
						badgeContent={
							<Button
								variant="contained"
								backgroundColor="rgba(60, 60, 60, 0.95)"
								color="white"
								toolTipText="Change Avatar"
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

					<Box
						marginLeft={2}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ flexGrow: 1 }}
					>
						<Box
							width="60%"
							height={160}
							display="flex"
							flexDirection="column"
							justifyContent="space-evenly"
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
								) : editMode ? (
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
								) : editMode ? (
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

						<Box>
							{!isLoading ? (
								!isUser ? (
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
									<Button
										variant="contained"
										backgroundColor="rgba(69, 69, 69, 0.68)"
										buttonStyle={{ py: 0 }}
										borderRadius={40}
										fontSize={20}
										buttonIcon={
											editMode ? <CheckRoundedIcon /> : <EditRoundedIcon />
										}
										type="submit"
										handleButtonClick={handleEditProfileClick}
									>
										{editMode ? "Confirm" : "Edit"}
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
					</Box>
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
			</Container>
		</Box>
	);
};

export default Profile;
