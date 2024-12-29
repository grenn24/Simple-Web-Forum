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

interface TopicsWithThreads {
	topicID: number;
	name: string;
	followStatus: boolean;
	threads: Thread[];
}

interface Thread {
	threadID: number;
	title: string;
	authorName: string;
	authorID: number;
	createdAt: Date;
	avatarIconLink: string;
	bookmarkedStatus: boolean;
	contentSummarised: string;
}
interface TopicProp {
	name: string;
	initialFollowStatus: boolean;
	threads: Thread[];
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
										"https://simple-web-forum-backend-61723a55a3b5.herokuapp.com/follows/user",
										{ followee_topic_id: topicID }
									);
								} else {
									postJSON(
										"https://simple-web-forum-backend-61723a55a3b5.herokuapp.com/follows/user",
										{ followee_topic_id: topicID }
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
										bookmarkedStatus={thread.bookmarkedStatus}
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
				"https://simple-web-forum-backend-61723a55a3b5.herokuapp.com/topics/threads",
				(res) => {
					const responseBody = res.data.data;
					let topicsWithThreads: TopicsWithThreads[] = [];

					for (let i = 0; i < responseBody.length; i++) {
						const threads: Thread[] = [];
						for (let j = 0; j < responseBody[i].threads.length; j++) {
							threads.push({
								threadID: responseBody[i].threads[j].thread_id,
								title: responseBody[i].threads[j].title,
								authorName: responseBody[i].threads[j].author_name,
								authorID: responseBody[i].threads[j].author_id,
								createdAt: new Date(responseBody[i].threads[j].created_at),
								avatarIconLink: responseBody[i].threads[j].avatar_icon_link,
								bookmarkedStatus: responseBody[i].threads[j].bookmarked_status,
								contentSummarised:
									responseBody[i].threads[j].content_summarised,
							});
						}
						topicsWithThreads.push({
							topicID: responseBody[i].topic_id,
							name: responseBody[i].name,
							followStatus: responseBody[i].follow_status,
							threads: threads,
						});
					}

					console.log(topicsWithThreads);

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
						/>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Topics;
