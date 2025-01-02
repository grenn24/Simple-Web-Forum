import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../components/List";
import { dateToTimeYear } from "../../utilities/dateToString";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useState, useEffect } from "react";
import { ThreadCardDTO } from "../../dtos/ThreadDTO";
import { Delete, get } from "../../utilities/apiClient";
import { removeFromArray } from "../../utilities/arrayManipulation";

const PostsPage = () => {
	const navigate = useNavigate();
	const [threads, setThreads] = useState<ThreadCardDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { authorID } = useParams();
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}/threads`,
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
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[]
	);
	return (
		<Box
			width="100%"
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			{isLoading && <CircularProgress size={70} />}
			<List
				listStyle={{ width: "100%" }}
				listItemsArray={threads.map((thread, index) => {
					return (
						<Box key={thread.threadID}>
							<Box
								display="flex"
								justifyContent="space-between"
								key={thread.threadID}
							>
								<Typography
									fontFamily="Open Sans"
									fontSize={22}
									fontWeight={600}
								>
									{thread.title}
								</Typography>
								<Box display="flex" alignItems="center">
									<Typography
										fontFamily="Open Sans"
										fontSize={15}
										fontWeight={600}
										fontStyle="text.secondary"
									>
										{dateToTimeYear(thread.createdAt, "short")}
									</Typography>
									<Button
										toolTipText="Delete Thread"
										color="primary.dark"
										buttonIcon={
											<DeleteForeverRoundedIcon sx={{ fontSize: 27 }} />
										}
										handleButtonClick={(event) => {
											event.stopPropagation();
											setThreads(removeFromArray(threads, index));
											Delete(
												`/threads/${thread.threadID}`,
												{},
												() => {},
												(err) => console.log(err)
											);
										}}
										buttonStyle={{ marginLeft: 1 }}
									/>
								</Box>
							</Box>

							<Typography
								variant="h6"
								color="text.secondary"
								fontFamily="Open Sans"
								fontSize={18}
							>
								{thread.topicsTagged.map((topic) => {
									return (
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
											key={topic.topicID}
										>
											{topic.name}
										</Button>
									);
								})}
							</Typography>
							<Typography marginTop={2} fontSize={17}>
								{thread.contentSummarised}
							</Typography>
						</Box>
					);
				})}
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

export default PostsPage;
