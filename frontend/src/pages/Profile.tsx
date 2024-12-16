import { Box, Container, Divider, Typography, Avatar } from "@mui/material";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import TabMenu from "../components/TabMenu/TabMenu";
import threadDataSample from "../features/Thread/threadDataSample";
import profileDataSample from "../features/Profile/profileDataSample";
import profileTabMenuLabels from "../features/Profile/profileTabMenuLabels";
import profileTabMenuPages from "../features/Profile/profileTabMenuPages";

const Profile = () => {
	const navigate = useNavigate();
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
						src={threadDataSample.avatarIconLink}
						sx={{ width: 100, height: 100 }}
					/>
					<Box marginLeft={2}>
						<Typography fontSize={35} fontWeight={600}>
							{profileDataSample.name}
						</Typography>
						<Typography fontSize={20} fontWeight={300}>
							{`@${profileDataSample.username}`}
						</Typography>
					</Box>
				</Box>

				<TabMenu
					tabLabelArray={profileTabMenuLabels}
					tabPageArray={profileTabMenuPages}
					variant="scrollable"
				/>
			</Container>
		</Box>
	);
};

export default Profile;
