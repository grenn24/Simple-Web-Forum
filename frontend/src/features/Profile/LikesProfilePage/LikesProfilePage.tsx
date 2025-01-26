import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../../components/List";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get } from "../../../utilities/api";
import LikeDTO from "../../../dtos/LikeDTO";
import { parseLikes } from "../../../utilities/parseApiResponse";
import ThreadCardMini from "./ThreadCardMini";

const LikesPage = () => {
	const navigate = useNavigate();
	const [likes, setLikes] = useState<LikeDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { authorID } = useParams();

	useEffect(
		() =>
			get<LikeDTO[]>(
				`/authors/${authorID === "User" ? "user" : authorID}/likes`,
				(res) => {
					const responseBody = res.data.data;
					const likes = parseLikes(
						responseBody,
						false,
						authorID === "User" ? ["private", "public"] : ["public"]
					);
					setLikes(likes);
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
			) : likes.length !== 0 ? (
				<>
					<Box width="97%" marginBottom={0.5}>
						<Typography textAlign="left" fontFamily="Open Sans" fontSize={22}>
							{likes.length} Likes
						</Typography>
					</Box>
					<List
						listStyle={{ width: "100%" }}
						listItemsArray={likes.map((like, _) => (
							<ThreadCardMini like={like} />
						))}
						listItemsDataValues={likes.map((like) =>
							String(like.thread.threadID)
						)}
						handleListItemsClick={new Array(likes.length).fill(
							(event: React.MouseEvent<HTMLElement>) =>
								navigate(`../Thread/${event.currentTarget.dataset?.value}`)
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
					No likes yet
				</Typography>
			)}
		</Box>
	);
};

export default LikesPage;
