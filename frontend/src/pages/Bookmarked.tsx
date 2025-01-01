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
import sortingMenuIcons from "../features/Bookmarked/sortingMenuIcons";
import sortingMenuItems from "../features/Bookmarked/sortingMenuItems";
import { ThreadCardDTO } from "../dtos/ThreadDTOs";
import { get } from "../utilities/apiClient";

const Bookmarked = () => {
	const [sortingOrder, setSortingOrder] = useState("Date Added (Newest)");
	const navigate = useNavigate();
	const [bookmarkedThreads, setBookmarkedThreads] = useState<ThreadCardDTO[]>(
		[]
	);

	useEffect(() => {
		get(
			"/authors/user/bookmarks",
			(res) => {
				const responseBody = res.data.data;
				const bookmarkedThreads = responseBody.map((bookmarkedThread: any) => ({
					threadID: bookmarkedThread.thread_id,
					title: bookmarkedThread.title,
					contentSummarised: bookmarkedThread.content_summarised,
					authorID: bookmarkedThread.author_id,
					authorName: bookmarkedThread.author_name,
					avatarIconLink: bookmarkedThread.avatar_icon_link,
					createdAt: new Date(bookmarkedThread.created_at),
					likes: bookmarkedThread.likes,
					imageTitle: bookmarkedThread.imageTitle,
					imageLink: bookmarkedThread.imageLink,
					likeCount: bookmarkedThread.like_count,
					commentCount: bookmarkedThread.comment_count,
					likeStatus: bookmarkedThread.like_status,
					bookmarkStatus: bookmarkedThread.bookmark_status
				}));
				setBookmarkedThreads(bookmarkedThreads);
			},
			(err) => console.log(err)
		);
	}, []);

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
						menuExpandedItemsArray={sortingMenuItems}
						menuExpandedIconsArray={sortingMenuIcons}
						menuIcon={<SortRoundedIcon sx={{ fontSize: 20 }} />}
						menuStyle={{
							borderRadius: 30,
							px: 2,
							py: 0,
							fontSize: 20,
							fontFamily: "Open Sans",
							color: "text.primary",
						}}
						handleMenuExpandedItemsClick={Array(sortingMenuItems.length).fill(
							(event: React.MouseEvent<HTMLElement>) =>
								event.currentTarget.dataset.value &&
								setSortingOrder(event.currentTarget.dataset.value)
						)}
						toolTipText="Sort Options"
						menuExpandedPosition={{ vertical: "top", horizontal: "right" }}
					>
						{sortingOrder}
					</Menu>
				</Box>
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
						marginBottom: 3,
					}}
					disableGutters
				>
					{bookmarkedThreads.map((bookmarkedThread) => (
						<Box key={bookmarkedThread.threadID}>
							<ThreadCard
								threadID={bookmarkedThread.threadID}
								threadTitle={bookmarkedThread.title}
								threadAuthor={bookmarkedThread.authorName}
								threadDate={new Date(bookmarkedThread.createdAt)}
								threadLikeCount={bookmarkedThread.likeCount}
								threadCommentCount={bookmarkedThread.commentCount}
								threadContentSummarised={bookmarkedThread.contentSummarised}
								threadImageLink={bookmarkedThread.imageLink}
								avatarIconLink={bookmarkedThread.avatarIconLink}
								threadLikeStatus={bookmarkedThread.likeStatus}
								threadBookmarkStatus={bookmarkedThread.bookmarkStatus}
								handleAvatarIconClick={() =>
									navigate(`../Profile/${bookmarkedThread.authorID}`)
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
