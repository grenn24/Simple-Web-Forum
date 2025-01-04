import {
	Box,
	Grid2 as Grid,
	Typography,
	Divider,
	useTheme,
	Container,
} from "@mui/material";
import ThreadGridCard from "../components/ThreadGridCard/ThreadGridCard";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import Button from "../components/Button";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { get, postJSON, Delete } from "../utilities/apiClient";
import { ThreadDTO } from "../dtos/ThreadDTO";
import ThreadGridCardsLoading from "../features/Topics/ThreadGridCardsLoading";
import { TopicDTO } from "../dtos/TopicDTO";
import { parseTopic, parseTopics } from "../utilities/parseApiResponse";

interface TopicProp {
	name: string;
	initialFollowStatus: boolean;
	threads: ThreadDTO[];
	topicID: number;
}

const Topic = ({ topicID, name, initialFollowStatus, threads }: TopicProp) => {
	const navigate = useNavigate();
	const screenWidth = useWindowSize().width as number;
	const theme = useTheme();
	const [followStatus, setFollowStatus] = useState(initialFollowStatus);

	return (
		<>
			<Box key={name} marginBottom={8} marginTop={5}>
				<Box display="flex" alignItems="center" justifyContent="space-between">
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
								Delete("/follows/user", { followee_topic_id: topicID }, (err) =>
									console.log(err)
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
									threadID={thread.threadID}
									threadAuthorName={thread.author.name}
									threadTitle={thread.title}
									threadCreatedAt={thread.createdAt}
									avatarIconLink={thread.author.avatarIconLink}
									threadContentSummarised={thread.content}
									threadinitialBookmarkStatus={thread.bookmarkStatus}
									handleAvatarIconClick={() => {
										navigate(`../Profile/${thread.author.authorID}`);
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

const Topics = () => {
	const navigate = useNavigate();

	const { topicID } = useParams();

	const [topicsWithThreads, setTopicsWithThreads] = useState<TopicDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(
		() =>
			get(
				`/topics${topicID ? `/${topicID}` : ""}/threads`,
				(res) => {
					const responseBody = res.data.data;
					if (topicID) {
						setTopicsWithThreads([parseTopic(responseBody)]);
					} else {
						setTopicsWithThreads(parseTopics(responseBody));
					}
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[topicID]
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
					{isLoading && <ThreadGridCardsLoading />}
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
