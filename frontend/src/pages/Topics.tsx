import {
	Box,
	Grid2 as Grid,
	Typography,
	Divider,
	useTheme,
	Container,
} from "@mui/material";
import ThreadGridCard from "../components/ThreadGridCard/ThreadGridCard";
import { useNavigate } from "react-router-dom";
import topics from "../features/Topics/topicsDataSample";
import { useWindowSize } from "@uidotdev/usehooks";
import Button from "../components/Button";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
} from "@mui/icons-material";
import { useState } from "react";

const Topics = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const screenWidth = useWindowSize().width as number;

	//const location = useLocation();
	//const queryParamaters = new URLSearchParams(location.search);
	//const topicName = queryParamaters.get("topicName");
	interface Thread {
		id: number;
		title: string;
		author: string;
		authorId: number;
		date: string;
		avatarIconLink: string;
		bookmarkedStatus: boolean;
		contentSummarised: string;
		handleAvatarIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
	}
	interface TopicProp {
		name: string;
		initialFollowStatus: boolean;
		threads: Thread[];
	}
	const Topic = ({ name, initialFollowStatus, threads }: TopicProp) => {
		const [followStatus, setFollowStatus] = useState(initialFollowStatus);
		return (
			<>
				<Box
					sx={{
						marginTop: 5,
					}}
					key={name}
					marginBottom={8}
				>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="h5"
							fontFamily="Open Sans"
							color="primary.dark"
							fontWeight={700}
							onClick={() => navigate(`../Topics/?topicName=${name}`)}
							sx={{ cursor: "pointer" }}
						>
							{name}
						</Typography>
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
					</Box>

					<Box>
						<Grid
							container
							columnSpacing={2.5}
							rowSpacing={2}
							sx={{ marginTop: 2 }}
						>
							{threads.map((thread) => (
								<Grid
									size={
										screenWidth > theme.breakpoints.values.md
											? 4
											: screenWidth > theme.breakpoints.values.sm
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
			</>
		);
	};

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
						buttonStyle={{ mx: 0, px: 0 }}
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
					{topics.map((topic) => (
						<Topic
							name={topic.name}
							initialFollowStatus={topic.followStatus}
							threads={topic.threads}
						/>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Topics;
