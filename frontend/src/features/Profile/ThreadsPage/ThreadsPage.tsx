import { Box, CircularProgress } from "@mui/material";
import List from "../../../components/List";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { Delete, get } from "../../../utilities/apiClient";
import { removeFromArray } from "../../../utilities/arrayManipulation";
import { parseThreads } from "../../../utilities/parseApiResponse";
import ThreadCardMini from "./ThreadCardMini";

const PostsPage = () => {
	const navigate = useNavigate();
	const [threads, setThreads] = useState<ThreadDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { authorID } = useParams();
	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}/threads`,
				(res) => {
					const responseBody = res.data.data;
					const threads: ThreadDTO[] = parseThreads(responseBody);
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
				listItemsArray={threads.map((thread, _) => {
					return (
						<ThreadCardMini thread={thread} threads={threads} setThreads={setThreads} />
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
