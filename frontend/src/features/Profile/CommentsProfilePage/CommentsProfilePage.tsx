import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../../components/List";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get } from "../../../utilities/api";
import { CommentDTO } from "../../../dtos/CommentDTO";
import { parseComments } from "../../../utilities/parseApiResponse";
import ThreadCardMini from "./ThreadCardMini";

const CommentsPage = () => {
	const navigate = useNavigate();
	const [comments, setComments] = useState<CommentDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { authorID } = useParams();

	useEffect(() => {
		get<CommentDTO[]>(
			`/authors/${authorID === "User" ? "user" : authorID}/comments`,
			(res) => {
				const responseBody = res.data.data;
				console.log(responseBody);
				const comments = parseComments(responseBody);
				setComments(comments);
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, []);
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={70} />
			) : comments.length !== 0 ? (
				<>
					<Box width="97%" marginBottom={0.5}>
						<Typography textAlign="left" fontFamily="Open Sans" fontSize={22}>
							{comments.length} Comments
						</Typography>
					</Box>

					<List
						listStyle={{ width: "100%" }}
						listItemsArray={comments.map((comment, _) => {
							return (
								<ThreadCardMini
									comment={comment}
									setComments={setComments}
									comments={comments}
								/>
							);
						})}
						listItemsDataValues={comments.map((comment, _) =>
							String(comment.thread.threadID)
						)}
						handleListItemsClick={new Array(comments.length).fill(
							(event: React.MouseEvent<HTMLElement>) =>
								event.currentTarget.dataset &&
								navigate(`../Thread/${event.currentTarget.dataset.value}`)
						)}
						listItemTextStyle={{ flexGrow: 1, width: "100%" }}
						listItemPadding={1.4}
						disableRipple
						divider
					/>
				</>
			) : (
				<Typography
					marginTop={4}
					fontStyle="primary.dark"
					fontFamily="Open Sans"
					fontSize={17}
				>
					No comments yet
				</Typography>
			)}
		</Box>
	);
};

export default CommentsPage;
