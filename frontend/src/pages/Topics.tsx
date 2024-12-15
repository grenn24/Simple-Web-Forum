import {
	Box,
	Grid2 as Grid,
	Typography,
	Divider,
	useTheme,
	Container,
} from "@mui/material";
import ThreadGridCard from "../components/ThreadCardMinimised/ThreadCardMinimised";
import { useNavigate  } from "react-router-dom";
import threadGroups from "../features/Topics/topicsDataSample";
import { useWindowSize } from "@uidotdev/usehooks";
import Button from "../components/Button";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Topics = () => {
	const navigate = useNavigate();
	const screenWidth = useWindowSize().width as number;

	//const location = useLocation();
	//const queryParamaters = new URLSearchParams(location.search);
	//const topicName = queryParamaters.get("topicName");

	return (
		<>
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
						Explore Topics
					</Typography>
				</Box>
				<Divider />
				<Box marginTop={2}>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0, px : 0}}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
				</Box>
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" },
						marginBottom: 3,
					}}
					disableGutters
				>
					{threadGroups.map((threadGroup) => (
						<Box
							sx={{
								marginTop: 5,
							}}
							key={threadGroup.topic}
							marginBottom={8}
						>
							<Typography
								variant="h5"
								fontFamily="Open Sans"
								color="primary.dark"
								fontWeight={700}
								onClick={() =>
									navigate(`../Topics/?topicName=${threadGroup.topic}`)
								}
								sx={{ cursor: "pointer" }}
							>
								{threadGroup.topic}
							</Typography>
							<Box>
								<Grid
									container
									columnSpacing={2.5}
									rowSpacing={2}
									sx={{ marginTop: 2 }}
								>
									{threadGroup.threads.map((thread) => (
										<Grid
											size={
												screenWidth > useTheme().breakpoints.values.md
													? 4
													: screenWidth > useTheme().breakpoints.values.sm
													? 6
													: 12
											}
											key={thread.id}
										>
											<ThreadGridCard
												threadId={thread.id}
												threadAuthor={thread.author}
												threadTitle={thread.title}
												threadDate={thread.date}
												avatarIconLink={thread.avatarIconLink}
												threadContentSummarised={thread.contentSummarised}
												bookmarkedStatus={thread.bookmarkedStatus}
												handleAvatarIconClick={() => {
													navigate(`../Profile/${thread.authorId}`);
												}}
											/>
										</Grid>
									))}
								</Grid>
							</Box>
						</Box>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Topics;
