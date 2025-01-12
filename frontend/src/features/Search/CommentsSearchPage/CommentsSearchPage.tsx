import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "../../../utilities/api";
import { parseComments } from "../../../utilities/parseApiResponse";
import { CommentDTO } from "../../../dtos/CommentDTO";
import List from "../../../components/List";
import CommentCardMini from "./CommentCardMini";
import { Box, CircularProgress, Typography } from "@mui/material";

const CommentsSearchPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [comments, setComments] = useState<CommentDTO[]>([]);
	const [searchParams, _] = useSearchParams();
	const query = searchParams.get("query");
	const navigate = useNavigate();
	useEffect(() => {
		setIsLoading(true);
		get(
			"/comments/search?query=" + query,
			(res) => {
				const responseBody = res.data.data;
				setComments(parseComments(responseBody));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [query]);

	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={80} />
			) : comments.length === 0 ? (
				<Typography
					fontFamily="Open Sans"
					fontSize={18}
					fontWeight={500}
					marginTop={10}
				>
					No comments were found related to "{query}". Did you mean something
					else?
				</Typography>
			) : (
				<List
					listItemsArray={comments.map((comment, index) => (
						<CommentCardMini key={index} comment={comment} />
					))}
					listItemsDataValues={comments.map((comment) =>
						String(comment.thread.threadID)
					)}
					handleListItemsClick={comments.map(
						() => (e: React.MouseEvent<HTMLElement>) =>
							navigate(`/Thread/${e.currentTarget.dataset.value}`)
					)}
					listItemTextStyle={{ flexGrow: 1 }}
					divider
					disableRipple
					listStyle={{ width: "100%" }}
				/>
			)}
		</Box>
	);
};

export default CommentsSearchPage;
