import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import List from "../../../components/List";
import { useNavigate, useSearchParams } from "react-router-dom";
import DiscussionCardMini from "./DiscussionCardMini";
import { DiscussionDTO } from "../../../dtos/DiscussionDTO";
import { get } from "../../../utilities/api";
import discussionSortOrder from "./discussionSortOrder";
import { parseDiscussions } from "../../../utilities/parseApiResponse";

const DiscussionsSearchPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [discussions, setDiscussions] = useState<DiscussionDTO[]>([]);
	const [searchParams, _] = useSearchParams();
	const query = searchParams.get("query");
	const sort = searchParams.get("sort");
	let currentSortIndex = 0;
	discussionSortOrder.forEach((label, index) => {
		if (label === sort) {
			currentSortIndex = index;
		}
	});
	const navigate = useNavigate();
	useEffect(() => {
		setIsLoading(true);
		get(
			`/discussions/search?query=${query}&sort=${currentSortIndex}`,
			(res) => {
				const responseBody = res.data.data;
				setDiscussions(parseDiscussions(responseBody));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [query, sort]);
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={80} />
			) : discussions.length === 0 ? (
				<Typography
					fontFamily="Open Sans"
					fontSize={18}
					fontWeight={500}
					marginTop={10}
				>
					No discussions were found related to "{query}". Did you mean something
					else?
				</Typography>
			) : (
				<List
					listItemsArray={discussions.map((discussion, index) => (
						<DiscussionCardMini key={index} discussion={discussion} />
					))}
					listItemsDataValues={discussions.map((discussion) =>
						String(discussion.discussionID)
					)}
					handleListItemsClick={discussions.map(
						() => (e: React.MouseEvent<HTMLElement>) =>
							navigate(`/Discussions/${e.currentTarget.dataset.value}`)
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

export default DiscussionsSearchPage;
