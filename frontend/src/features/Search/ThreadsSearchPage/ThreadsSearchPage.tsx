import React, { useEffect, useRef, useState } from "react";
import { get } from "../../../utilities/api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { parseThreads } from "../../../utilities/parseApiResponse";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import List from "../../../components/List";
import { Box, CircularProgress, Typography } from "@mui/material";
import ThreadCardMini from "./ThreadCardMini";
import threadSortOrder from "./threadSortOrder";

const ThreadsSearchPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [threads, setThreads] = useState<ThreadDTO[]>([]);
	const [searchParams, _] = useSearchParams();
	const query = searchParams.get("query");
	const sort = searchParams.get("sort");
	const boxRef = useRef();
	const location = useLocation();

	const navigate = useNavigate();
	useEffect(() => {
		setIsLoading(true);
		get(
			`/threads/search?query=${query}&sort=${
				sort ? threadSortOrder.findIndex((element) => element === sort) : 0
			}`,
			(res) => {
				const responseBody = res.data.data;
				setThreads(parseThreads(responseBody));
				setIsLoading(false);
				window.scrollTo(0, Number(sessionStorage.getItem(location.key)));
			},
			(err) => console.log(err)
		);
	}, [query, sort]);

	return (
		<Box
			width="100%"
			display="flex"
			flexDirection="column"
			alignItems="center"
			ref={boxRef}
		>
			{isLoading ? (
				<CircularProgress size={80} />
			) : threads.length === 0 ? (
				<Typography
					fontFamily="Open Sans"
					fontSize={18}
					fontWeight={500}
					marginTop={10}
				>
					No threads were found related to "{query}". Did you mean something
					else?
				</Typography>
			) : (
				<List
					listItemsArray={threads.map((thread, index) => (
						<ThreadCardMini key={index} thread={thread} />
					))}
					listItemsDataValues={threads.map((thread) => String(thread.threadID))}
					handleListItemsClick={threads.map(
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

export default ThreadsSearchPage;
