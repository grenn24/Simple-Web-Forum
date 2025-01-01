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
import sortingMenuItems from "../features/Following/sortingMenuItems";
import sortingMenuIcons from "../features/Following/sortingMenuIcons";
import { get } from "../utilities/apiClient";
import { ThreadCardDTO } from "../dtos/ThreadDTO";

const Following = () => {
	const [sortingOrder, setSortingOrder] = useState("Best");

	const navigate = useNavigate();

	const [followedThreads, setFollowedThreads] = useState<ThreadCardDTO[]>([]);

	useEffect(
		() =>
			get(
				"./authors/user/follows",
				(res) => {
					const responseBody = res.data.data;
					const followedThreads = responseBody.map((likedThread: any) => ({
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
						bookmarkStatus: likedThread.bookmark_status,
					}));
					setFollowedThreads(followedThreads);
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
						Following
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
					{followedThreads.map((followedThread) => (
						<Box key={followedThread.threadID}>
							<ThreadCard
								threadID={followedThread.threadID}
								threadTitle={followedThread.title}
								threadAuthor={followedThread.authorName}
								threadCreatedAt={followedThread.createdAt}
								threadLikeCount={followedThread.likeCount}
								threadCommentCount={followedThread.commentCount}
								threadContentSummarised={followedThread.contentSummarised}
								threadImageLink={followedThread.imageLink}
								avatarIconLink={followedThread.avatarIconLink}
								threadLikeStatus={followedThread.likeStatus}
								threadBookmarkStatus={followedThread.bookmarkStatus}
								handleAvatarIconClick={() =>
									navigate(`../Profile/${followedThread.authorID}`)
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

export default Following;
