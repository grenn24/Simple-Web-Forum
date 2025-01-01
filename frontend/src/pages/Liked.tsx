import { Box, Divider, Typography, Container } from "@mui/material";
import { useEffect, useState } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Menu from "../components/Menu";
import sortingMenuIcons from "../features/Liked/sortingMenuIcons";
import sortingMenuItems from "../features/Liked/sortingMenuItems";
import { get } from "../utilities/apiClient";
import { ThreadCardDTO } from "../dtos/ThreadDTOs";


const Liked = () => {
	const [sortingOrder, setSortingOrder] = useState("Likes (Highest)");
	const navigate = useNavigate();
	const [likedThreads, setLikedThreads] = useState<ThreadCardDTO[]>([]);

	useEffect(
		() =>
			get(
				"/authors/user/likes",
				(res) => {
					const responseBody = res.data.data;
					const likedThreads = responseBody.map((likedThread: any) => ({
						threadID: likedThread.thread_id,
						title: likedThread.title,
						contentSummarised: likedThread.content_summarised,
						authorID: likedThread.author_id,
						authorName: likedThread.author_name,
						avatarIconLink: likedThread.avatar_icon_link,
						createdAt: new Date(likedThread.created_at),
						likes: likedThread.likes,
						imageTitle: likedThread.imageTitle,
						imageLink: likedThread.imageLink,
						likeCount: likedThread.like_count,
						commentCount: likedThread.comment_count,
						likeStatus: likedThread.like_status,
						bookmarkStatus: likedThread.bookmark_status
					}));
					setLikedThreads(likedThreads);
				},
				(err) => console.log(err)
			),
		[]
	);

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
						Liked
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
					{likedThreads.map((likedThread) => (
						<Box key={likedThread.threadID}>
							<ThreadCard
								threadID={likedThread.threadID}
								threadTitle={likedThread.title}
								threadAuthor={likedThread.authorName}
								threadCreatedAt={likedThread.createdAt}
								threadLikeCount={likedThread.likeCount}
								threadCommentCount={likedThread.commentCount}
								threadContentSummarised={likedThread.contentSummarised}
								threadImageLink={likedThread.imageLink}
								avatarIconLink={likedThread.avatarIconLink}
								threadLikeStatus={likedThread.likeStatus}
								threadBookmarkStatus={likedThread.bookmarkStatus}
								handleAvatarIconClick={() =>
									navigate(`../Profile/${likedThread.authorID}`)
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

export default Liked;
