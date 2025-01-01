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
import { useWindowSize } from "@uidotdev/usehooks";
import Button from "../components/Button";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { get, postJSON, Delete } from "../utilities/apiClient";
import { ThreadCardDTO } from "../dtos/ThreadDTO";

interface TopicsWithThreads {
	topicID: number;
	name: string;
	followStatus: boolean;
	threads: ThreadCardDTO[];
}

interface TopicProp {
	name: string;
	initialFollowStatus: boolean;
	threads: ThreadCardDTO[];
	topicID: number;
}

const Topics = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const screenWidth = useWindowSize().width as number;

	//const location = useLocation();
	//const queryParamaters = new URLSearchParams(location.search);
	//const topicName = queryParamaters.get("topicName");

	const Topic = ({
		topicID,
		name,
		initialFollowStatus,
		threads,
	}: TopicProp) => {
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
							onClick={() => navigate(`../Topics/${topicID}`)}
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
							handleButtonClick={() => {
								if (followStatus) {
									Delete(
										"/follows/user",
										{ followee_topic_id: topicID },
										(err) => console.log(err)
									);
								} else {
									postJSON(
										"/follows/user",
										{ followee_topic_id: topicID },
										(err) => console.log(err)
									);
								}
								setFollowStatus(!followStatus);
							}}
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
									key={thread.threadID}
								>
									<ThreadGridCard
										threadId={thread.threadID}
										threadAuthorName={thread.authorName}
										threadTitle={thread.title}
										threadCreatedAt={thread.createdAt}
										avatarIconLink={thread.avatarIconLink}
										threadContentSummarised={thread.contentSummarised}
										threadinitialBookmarkStatus={thread.bookmarkStatus}
										handleAvatarIconClick={() => {
											navigate(`../Profile/${thread.authorID}`);
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

	const [topicsWithThreads, setTopicsWithThreads] = useState<
		TopicsWithThreads[]
	>([]);

	useEffect(
		() =>
			get(
				"/topics/threads",
				(res) => {
					const responseBody = res.data.data;
					const topicsWithThreads: TopicsWithThreads[] = responseBody.map(
						(topicWithThread: any) => ({
							topicID: topicWithThread.topic_id,
							name: topicWithThread.name,
							followStatus: topicWithThread.follow_status,
							threads: topicWithThread.threads.map((thread: any) => ({
								threadID: thread.thread_id,
								title: thread.title,
								authorName: thread.author_name,
								authorID: thread.author_id,
								createdAt: new Date(thread.created_at),
								avatarIconLink: thread.avatar_icon_link,
								bookmarkStatus: thread.bookmark_status,
								contentSummarised: thread.content_summarised,
							})),
						})
					);
					setTopicsWithThreads(topicsWithThreads);
				},
				(err) => console.log(err)
			),
		[]
	);

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
					{topicsWithThreads.map((topic) => (
						<Topic
							name={topic.name}
							initialFollowStatus={topic.followStatus}
							threads={topic.threads}
							topicID={topic.topicID}
							key={topic.topicID}
						/>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Topics;
