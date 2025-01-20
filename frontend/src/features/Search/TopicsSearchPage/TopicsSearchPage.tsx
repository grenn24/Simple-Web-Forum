import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TopicDTO } from "../../../dtos/TopicDTO";
import { parseTopics } from "../../../utilities/parseApiResponse";
import { get } from "../../../utilities/api";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../../components/List";
import TopicCardMini from "./TopicCardsViewer";
import topicSortOrder from "./topicSortOrder";

const TopicsSearchPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [topics, setTopics] = useState<TopicDTO[]>([]);
	const [searchParams, _] = useSearchParams();
	const query = searchParams.get("query");
	const sort = searchParams.get("sort");
	let currentSortIndex = 0;
	topicSortOrder.forEach((label, index) => {
		if (label === sort) {
			currentSortIndex = index;
		}
	});
	const navigate = useNavigate();
	useEffect(() => {
		setIsLoading(true);
		get(
			`/topics/search?query=${query}&sort=${currentSortIndex}`,
			(res) => {
				const responseBody = res.data.data;
				setTopics(parseTopics(responseBody));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [query,sort]);

	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={80} />
			) : topics.length === 0 ? (
				<Typography
					fontFamily="Open Sans"
					fontSize={18}
					fontWeight={500}
					marginTop={10}
				>
					No topics were found related to "{query}". Did you mean something
					else?
				</Typography>
			) : (
				<List
					listItemsArray={topics.map((topic, index) => (
						<TopicCardMini key={index} topic={topic} />
					))}
					listItemsDataValues={topics.map((topic) => String(topic.topicID))}
					handleListItemsClick={topics.map(
						() => (e: React.MouseEvent<HTMLElement>) =>
							navigate(`/Topics/${e.currentTarget.dataset.value}`)
					)}
					listItemTextStyle={{ flexGrow: 1, maxWidth: "100%" }}
					divider
					disableRipple
					listStyle={{ flexGrow: 1, maxWidth: "100%", width:"100%" }}
				/>
			)}
		</Box>
	);
};

export default TopicsSearchPage;
