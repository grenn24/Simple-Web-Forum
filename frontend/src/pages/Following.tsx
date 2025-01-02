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
import sortOrder from "../features/Following/sortOrder";
import sortIcons from "../features/Following/sortIcons";
import { get } from "../utilities/apiClient";
import { ThreadCardDTO } from "../dtos/ThreadDTO";

const Following = () => {
	const [sortIndex, setSortIndex] = useState(0);

	const navigate = useNavigate();

	const [followedThreads, setFollowedThreads] = useState<ThreadCardDTO[]>([]);

	useEffect(
		() =>
			get(
				"./authors/user/follows?sort="+sortIndex,
				(res) => {
					const responseBody = res.data.data;
					const threads = responseBody
						.filter((thread: any) => thread.archive_status === false)
						.map((thread: any) => ({
							threadID: thread.thread_id,
							title: thread.title,
							contentSummarised: thread.content_summarised,
							authorID: thread.author_id,
							authorName: thread.author_name,
							avatarIconLink: thread.avatar_icon_link,
							createdAt: new Date(thread.created_at),
							likes: thread.likes,
							imageTitle: thread.imageTitle,
							imageLink: thread.imageLink,
							likeCount: thread.like_count,
							commentCount: thread.comment_count,
							likeStatus: thread.like_status,
							bookmarkStatus: thread.bookmark_status,
							archiveStatus: thread.archive_status,
						}));
					setFollowedThreads(threads);
				},
				(err) => console.log(err)
			),
		[sortIndex]
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
						menuExpandedItemsArray={sortOrder}
						menuExpandedIconsArray={sortIcons}
						menuExpandedDataValuesArray={sortOrder.map((_, index) =>
							index
						)}
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
								threadArchiveStatus={followedThread.archiveStatus}
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
