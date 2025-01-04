import { Box, Divider, Typography, Container } from "@mui/material";
import { useState, useEffect } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Menu from "../components/Menu";
import sortIcons from "../features/Bookmarked/sortIcons";
import sortOrder from "../features/Bookmarked/sortOrder";
import { ThreadDTO } from "../dtos/ThreadDTO";
import { get } from "../utilities/apiClient";
import ThreadCardLoading from "../components/ThreadCard/ThreadCardLoading";
import { parseThreads } from "../utilities/parseApiResponse";

const Bookmarked = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [sortIndex, setSortIndex] = useState(0);
	const navigate = useNavigate();
	const [bookmarkedThreads, setBookmarkedThreads] = useState<ThreadDTO[]>([]);

	useEffect(() => {
		get<ThreadDTO[]>(
			"/authors/user/bookmarks?sort=" + sortIndex,
			(res) => {
				const responseBody = res.data.data;
				const threads = parseThreads(responseBody, true);
				setBookmarkedThreads(threads);
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [sortIndex]);

	return (
		<>
			<Box
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: { xs: 1.5, sm: 3 },
					minHeight: "100%",
				}}
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="primary.dark"
					>
						Bookmarked
					</Typography>
				</Box>
				<Divider />
				<Box
					sx={{ marginTop: 2 }}
					display="flex"
					justifyContent="space-between"
				>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0, px: 0 }}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
					<Menu
						menuExpandedItemsArray={sortOrder}
						menuExpandedIconsArray={sortIcons}
						menuExpandedDataValuesArray={sortOrder.map((_, index) => index)}
						menuIcon={<SortRoundedIcon sx={{ fontSize: 20 }} />}
						menuStyle={{
							borderRadius: 30,
							px: 2,
							py: 0,
							fontSize: 20,
							fontFamily: "Open Sans",
							color: "text.primary",
						}}
						handleMenuExpandedItemsClick={Array(sortOrder.length).fill(
							(event: React.MouseEvent<HTMLElement>) =>
								event.currentTarget.dataset.value &&
								setSortIndex(Number(event.currentTarget.dataset.value))
						)}
						toolTipText="Sort Options"
						menuExpandedPosition={{ vertical: "top", horizontal: "right" }}
					>
						{sortOrder[sortIndex]}
					</Menu>
				</Box>
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
						marginBottom: 3,
					}}
					disableGutters
				>
					{isLoading && <ThreadCardLoading bodyHeight={180} />}
					{bookmarkedThreads.map((bookmarkedThread) => (
						<Box key={bookmarkedThread.threadID}>
							<ThreadCard
								threadID={bookmarkedThread.threadID}
								threadTitle={bookmarkedThread.title}
								threadAuthor={bookmarkedThread.author.name}
								threadCreatedAt={bookmarkedThread.createdAt}
								threadLikeCount={bookmarkedThread.likeCount}
								threadCommentCount={bookmarkedThread.commentCount}
								threadContentSummarised={bookmarkedThread.content}
								threadImageLink={bookmarkedThread.imageLink}
								avatarIconLink={bookmarkedThread.author.avatarIconLink}
								threadLikeStatus={bookmarkedThread.likeStatus}
								threadBookmarkStatus={bookmarkedThread.bookmarkStatus}
								threadArchiveStatus={bookmarkedThread.archiveStatus}
								handleAvatarIconClick={() =>
									navigate(`../Profile/${bookmarkedThread.author.authorID}`)
								}
							/>
							<Divider />
						</Box>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Bookmarked;
