import { Box, Typography } from "@mui/material";
import List from "../../components/List";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useState, useEffect } from "react";
import { CommentDTO } from "../../dtos/ThreadDTOs";
import { Delete, get } from "../../utilities/apiClient";
import { dateToTimeYear } from "../../utilities/dateToString";
import removeFromArray from "../../utilities/removeFromArray";

const CommentsPage = () => {
	const navigate = useNavigate();
	const [comments, setComments] = useState<CommentDTO[]>([]);
	useEffect(() => {
		get(
			"/authors/user/comments",
			(res) => {
				const responseBody = res.data.data;

				const comments = responseBody.map((comment: any) => ({
					commentID: comment.comment_id,
					threadID: comment.thread_id,
					threadTitle: comment.thread_title,
					threadContentSummarised: comment.thread_content_summarised,
					content: comment.content,
					createdAt: new Date(comment.created_at),
					authorID: comment.author_id,
					authorName: comment.author_name,
					topicsTagged: comment.topics_tagged.map((topic: any) => ({
						topicID: topic.topic_id,
						name: topic.name,
					})),
				}));

				setComments(comments);
			},
			(err) => console.log(err)
		);
	}, []);
	return (
		<Box width="100%">
			<List
				listItemsArray={comments.map((comment, index) => {
					return (
						<>
							<Box key={comment.commentID}>
								<Box display="flex" justifyContent="space-between">
									<Typography
										fontFamily="Open Sans"
										fontSize={22}
										fontWeight={600}
									>
										{comment.threadTitle}
									</Typography>
									<Box display="flex" alignItems="center">
										<Typography
											fontFamily="Open Sans"
											fontSize={15}
											fontWeight={600}
											fontStyle="text.secondary"
										>
											{dateToTimeYear(comment.createdAt, "short")}
										</Typography>
										<Button
											toolTipText="Delete Comment"
											color="primary.dark"
											buttonIcon={
												<DeleteForeverRoundedIcon sx={{ fontSize: 27 }} />
											}
											handleButtonClick={(event) => {
												event.stopPropagation();
												setComments(removeFromArray(comments, index));
												Delete(
													`/comments/${comment.commentID}`,
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
									{comment.topicsTagged.map((topic) => {
										return (
											<Button
												key={topic.topicID}
												disableRipple
												handleButtonClick={() =>
													navigate(`../Topics?topicName=${topic}`)
												}
												fontFamily="Open Sans"
												buttonStyle={{ px: 1, py: 0, marginRight: 1 }}
												color="text.secondary"
												fontSize={12}
												variant="outlined"
												backgroundColor="primary.light"
											>
												{topic.name}
											</Button>
										);
									})}
								</Typography>
								<Typography marginTop={2} fontSize={17}>
									{comment.content}
								</Typography>
								<Box display="flex">
									<Typography
										marginTop={2}
										fontSize={17}
										marginRight={1.7}
										fontWeight={750}
									>
										You Replied:
									</Typography>
									<Typography marginTop={2} fontSize={17}>
										{comment.content}
									</Typography>
								</Box>
							</Box>
						</>
					);
				})}
				listItemsDataValues={comments.map((comment, _) =>
					String(comment.threadID)
				)}
				handleListItemsClick={new Array(comments.length).fill(
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

export default CommentsPage;
