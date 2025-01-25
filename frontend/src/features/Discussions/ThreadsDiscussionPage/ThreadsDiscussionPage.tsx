import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Menu from "../../../components/Menu";
import sortOrder from "./sortOrder";
import sortIcons from "./sortIcons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ThreadCard from "../../../components/ThreadCard";
import { removeFromArray } from "../../../utilities/arrayManipulation";
import cryingCat from "../../../assets/image/crying-cat.png";
import { SortRounded as SortRoundedIcon } from "@mui/icons-material";
import { get } from "../../../utilities/api";
import { parseThreads } from "../../../utilities/parseApiResponse";
import { ThreadDTO } from "../../../dtos/ThreadDTO";

const ThreadsDiscussionPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [searchParams, _] = useSearchParams();
	const sort = searchParams.get("sort");
	const { discussionID } = useParams();
	const [threads, setThreads] = useState<ThreadDTO[]>([]);
	useEffect(() => {
		setIsLoading(true);
		get(
			`/discussions/${discussionID}/threads?sort=${
				sort ? String(sortOrder.findIndex((element) => element === sort)) : "0"
			}`,
			(res) => {
				const responseBody = res.data.data;
				setThreads(parseThreads(responseBody));

				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [sort]);
	const handleDeleteThread = (index: number) =>
		setThreads(removeFromArray(threads, index));

	return (
		<Box width="100%">
			<Box
				display="flex"
				justifyContent="flex-end"
				marginBottom={2}
				width="100%"
			>
				<Menu
					menuExpandedItemsArray={sortOrder}
					menuExpandedIconsArray={sortIcons}
					menuExpandedDataValuesArray={sortOrder.map((sort) => sort)}
					menuIcon={<SortRoundedIcon sx={{ fontSize: 20 }} />}
					menuStyle={{
						borderRadius: 30,
						px: 2,
						py: 0,
						fontSize: 20,
						fontFamily: "Open Sans",
						color: "primary.dark",
					}}
					handleMenuExpandedItemsClick={Array(sortOrder.length).fill(
						(event: React.MouseEvent<HTMLElement>) =>
							navigate(`?type=Threads&sort=${event.currentTarget.dataset?.value}`)
					)}
					toolTipText="Sort Options"
					menuExpandedPosition={{
						vertical: "top",
						horizontal: "right",
					}}
				>
					{
						sortOrder[
							sort ? sortOrder.findIndex((element) => element === sort) : 0
						]
					}
				</Menu>
			</Box>
			{isLoading ? (
				<Box sx={{ marginTop: 2 }} textAlign="center">
					<CircularProgress size={80} />
				</Box>
			) : (
				<>
					{threads.length === 0 ? (
						<Box
							width="100%"
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							marginTop={5}
						>
							<Typography
								textAlign="center"
								fontFamily="Open Sans"
								fontSize={19}
								color="primary.dark"
							>
								No threads in this discussion for now
							</Typography>
							<br />

							<img
								src={cryingCat}
								width={220}
								alt="crying cat"
								loading="eager"
							/>
						</Box>
					) : (
						threads.map((thread, index) => (
							<Box key={index} width="100%">
								<ThreadCard
									thread={thread}
									handleDeleteThread={() => handleDeleteThread(index)}
								/>
								<Divider sx={{ my: 3 }} />
							</Box>
						))
					)}
				</>
			)}
		</Box>
	);
};

export default ThreadsDiscussionPage;
