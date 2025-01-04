import { Box, CircularProgress} from "@mui/material";
import List from "../../../components/List";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get } from "../../../utilities/apiClient";
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
			{isLoading && <CircularProgress size={70} />}
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
				disablePadding
				disableRipple
				divider
			/>
		</Box>
	);
};

export default CommentsPage;
