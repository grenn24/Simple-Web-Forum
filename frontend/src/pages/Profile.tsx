import { Box, Container, Divider, Typography, Avatar, useTheme, useMediaQuery } from "@mui/material";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowBackRounded as ArrowBackRoundedIcon, NotificationsNoneRounded as NotificationsNoneRoundedIcon, NotificationsActiveRounded as NotificationsActiveRoundedIcon } from "@mui/icons-material";
import TabMenu from "../components/TabMenu/TabMenu";
import profileTabMenuLabels from "../features/Profile/profileTabMenuLabels";
import profileTabMenuPages from "../features/Profile/profileTabMenuPages";
import { get } from "../utilities/apiClient";

const Profile = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [followStatus, setFollowStatus] = useState(false);
	const {authorID} = useParams();
	const [isUser, setIsUser] = useState(true);
	const [author, setAuthor] = useState({
		authorID: 0,
		name: "",
		username: "",
		email: "",
		passwordHash: "",
		avatarIconLink: "",
		createdAt: new Date,
		isUser: false
	});
	useEffect(
		() =>
			get(
				"/authors/" + (authorID === "User" ? "user" : authorID),
				(res) => {
					const responseBody = res.data.data
					const author = {
						authorID: responseBody.author_id,
						name: responseBody.name,
						username: responseBody.username,
						email: responseBody.email,
						passwordHash: responseBody.password_hash,
						avatarIconLink: responseBody.avatar_icon_link,
						createdAt: new Date(responseBody.created_at),
						isUser: responseBody.is_user
					}
					setAuthor(author)
					setIsUser(author.isUser)
				},
				(err) => console.log(err)
			),
		[]
	);
	
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
					my: 3,
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
				disableGutters
			>
				<Box display="flex" width="100%" alignItems="center" marginBottom={2}>
					<Avatar
						src={author.avatarIconLink}
						sx={{ width: 90, height: 90 }}
					/>
					<Box
						marginLeft={2}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ flexGrow: 1 }}
					>
						<Box>
							<Typography fontSize={32} fontWeight={600}>
								{author.name}
							</Typography>
							<Typography fontSize={18} fontWeight={300}>
								{`@${author.username}`}
							</Typography>
						</Box>
						<Box>
							{!isUser ?<Button
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
							</Button>: null }
							
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
