import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../components/List";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import UnarchiveRoundedIcon from "@mui/icons-material/UnarchiveRounded";
import { useState, useEffect } from "react";
import { Delete, get } from "../../utilities/apiClient";
import { ThreadCardDTO, TopicDTO } from "../../dtos/ThreadDTO";
import { dateToTimeYear } from "../../utilities/dateToString";

interface ThreadCardMiniProp {
	threadID: number;
	title: string;
	createdAt: string;
	initialLikeCount?: number;
	topicsTagged: TopicDTO[];
	likeCount?: number;
	contentSummarised: string;
	initialLikeStatus?: boolean;
	setThreads?: React.Dispatch<React.SetStateAction<ThreadCardDTO[]>>;
	threads?: ThreadCardDTO[];
}

const ThreadCardMini = ({
	threadID,
	title,
	createdAt,
	topicsTagged,
	contentSummarised,
	setThreads,
	threads,
}: ThreadCardMiniProp) => {
	const navigate = useNavigate();
	return (
		<Box key={threadID}>
			<Box display="flex" justifyContent="space-between" marginBottom={0.4}>
				<Typography fontFamily="Open Sans" fontSize={22} fontWeight={600}>
					{title}
				</Typography>
				<Box display="flex" alignItems="center">
					<Typography
						fontFamily="Open Sans"
						fontSize={15}
						fontWeight={600}
						fontStyle="text.secondary"
					>
						{createdAt}
					</Typography>
					<Button
						toolTipText="Unarchive Thread"
						color="primary.dark"
						buttonIcon={<UnarchiveRoundedIcon sx={{ fontSize: 24 }} />}
						handleButtonClick={(event) => {
							event.stopPropagation();
							threads &&
								setThreads &&
								setThreads(
									threads.filter((thread) => thread.threadID !== threadID)
								);
							Delete(
								`/threads/${threadID}/archives/user`,
								{},
								() => {},
								(err) => console.log(err)
							);
						}}
					/>
				</Box>
			</Box>
			<Typography
				variant="h6"
				color="text.secondary"
				fontFamily="Open Sans"
				fontSize={18}
			>
				{topicsTagged.map((topic) => {
					return (
						<>
							<Button
								disableRipple
								handleButtonClick={(event) => {
									event.stopPropagation();
									navigate(`../Topics/${topic.topicID}`);
								}}
								fontFamily="Open Sans"
								buttonStyle={{ px: 1, py: 0, marginRight: 1 }}
								color="text.secondary"
								fontSize={12}
								variant="outlined"
								backgroundColor="primary.light"
							>
								{topic.name}
							</Button>
						</>
					);
				})}
			</Typography>
			<Typography marginTop={2} fontSize={17}>
				{contentSummarised}
			</Typography>
		</Box>
	);
};

const RemovedPage = () => {
	const navigate = useNavigate();
	const [threads, setThreads] = useState<ThreadCardDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true)

	useEffect(
		() =>
			get(
				"/authors/user/archives",
				(res) => {
					const responseBody = res.data.data;
					const threads: ThreadCardDTO[] = responseBody.map((thread: any) => ({
						threadID: thread.thread_id,
						title: thread.title,
						createdAt: new Date(thread.created_at),
						authorID: thread.author_id,
						authorName: thread.name,
						contentSummarised: thread.content_summarised,
						topicsTagged: thread.topics_tagged.map((topic: any) => ({
							topicID: topic.topic_id,
							name: topic.name,
						})),
					}));
					setThreads(threads);
					setIsLoading(false)
				},
				(err) => console.log(err)
			),
		[]
	);
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading && <CircularProgress size={70} />}
			<List
				listStyle={{ width: "100%" }}
				listItemsArray={threads.map((thread) => (
					<ThreadCardMini
						threadID={thread.threadID}
						title={thread.title}
						createdAt={dateToTimeYear(thread.createdAt, "short")}
						topicsTagged={thread.topicsTagged}
						contentSummarised={thread.contentSummarised}
						setThreads={setThreads}
						threads={threads}
					/>
				))}
				listItemsDataValues={threads.map((thread, _) =>
					String(thread.threadID)
				)}
				handleListItemsClick={new Array(threads.length).fill(
					(event: React.MouseEvent<HTMLElement>) =>
						event.currentTarget.dataset &&
						navigate(`../Thread/${event.currentTarget.dataset.value}`)
				)}
				disablePadding
				disableRipple
				divider
			/>
		</Box>
	);
};

export default RemovedPage;
