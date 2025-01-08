import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../../components/List";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { get } from "../../../utilities/apiClient";
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
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={70} />
			) : threads.length !== 0 ? (
				<>
					<Box width="97%" marginBottom={0.5}>
						<Typography
							textAlign="left"
							fontFamily="Open Sans"
							fontSize={22}
							
						>
							{threads.length} Posts
						</Typography>
					</Box>

					<List
						listStyle={{ width: "100%" }}
						listItemsArray={threads.map((thread, _) => {
							return (
								<ThreadCardMini
									thread={thread}
									threads={threads}
									setThreads={setThreads}
								/>
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
						listItemTextStyle={{ flexGrow: 1 }}
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
					No posts yet
				</Typography>
			)}
		</Box>
	);
};

export default PostsPage;
