import { Box, Typography } from "@mui/material";
import List from "../../components/List";
import profileDataSample from "./profileDataSample";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
	FavoriteRounded as FavoriteRoundedIcon,
	FavoriteBorderRounded as FavoriteBorderRoundedIcon,
} from "@mui/icons-material";
import playerGenerator from "../../utilities/playerGenerator";
import likeSound from "../../assets/audio/like-sound.mp3";
import { useState, useEffect } from "react";
import { ThreadCardDTO, TopicDTO } from "../../dtos/ThreadDTOs";
import { get } from "../../utilities/apiClient";
import dateToString from "../../utilities/dateToString";
import { Delete, postJSON } from "../../utilities/apiClient";

interface ThreadCardMiniProp {
	threadID: number;
	title: string;
	date: string;
	initialLikeCount: number;
	topicsTagged: string[];
	likeCount: number;
	contentSummarised: string;
	initialLikeStatus: boolean;
}
const ThreadCardMini = ({
	threadID,
	title,
	date,
	initialLikeStatus,
	topicsTagged,
	initialLikeCount,
	contentSummarised,
}: ThreadCardMiniProp) => {
	const [likeStatus, setLikeStatus] = useState(initialLikeStatus);
	const [likeCount, setCount] = useState(initialLikeCount);
	const player = playerGenerator(
		likeSound,
		0.9,
		{ default: [90, 3000] },
		"default"
	);
	const navigate = useNavigate();

	return (
		<>
			<Box display="flex" justifyContent="space-between" marginBottom={1}>
				<Typography fontFamily="Open Sans" fontSize={22} fontWeight={600}>
					{title}
				</Typography>
				<Typography
					fontFamily="Open Sans"
					fontSize={15}
					fontWeight={600}
					fontStyle="text.secondary"
				>
					{date}
				</Typography>
			</Box>
			<Typography
				variant="h6"
				color="text.secondary"
				fontFamily="Open Sans"
				fontSize={18}
			>
				{topicsTagged.map((topic) => {
					return (
						<>
							<Button
								disableRipple
								handleButtonClick={() =>
									navigate(`../Topics?topicName=${topic}`)
								}
								fontFamily="Open Sans"
								buttonStyle={{ px: 1, py: 0, marginRight: 1 }}
								color="text.secondary"
								fontSize={12}
								variant="outlined"
								backgroundColor="primary.light"
							>
								{topic}
							</Button>
						</>
					);
				})}
			</Typography>
			<Typography marginTop={2} marginBottom={1} fontSize={17}>
				{contentSummarised}
			</Typography>
			<Button
				component="button"
				role={undefined}
				variant="outlined"
				buttonIcon={
					likeStatus ? (
						<FavoriteRoundedIcon sx={{ color: "red" }} />
					) : (
						<FavoriteBorderRoundedIcon />
					)
				}
				color="primary.dark"
				borderRadius={30}
				borderColor="primary.light"
				buttonStyle={{
					py: 0,
					px: 0.6,
				}}
				handleButtonClick={(event) => {
					event.stopPropagation();
					setLikeStatus(!likeStatus);
					if (likeStatus) {
						setCount(likeCount - 1);
						Delete(
							"/likes/user",
							{
								thread_id: threadID,
							},
							() => {},
							(err) => console.log(err)
						);
					} else {
						player();
						setCount(likeCount + 1);
						postJSON(
							"/likes/user",
							{
								thread_id: threadID,
							},
							() => {},
							(err) => console.log(err)
						);
					}
				}}
				fontSize={14}
			>
				{String(likeCount)}
			</Button>
		</>
	);
};
const LikesPage = () => {
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
						topicsTagged: likedThread.topics_tagged,
					}));
					setLikedThreads(likedThreads);
					console.log(likedThreads)
				},
				(err) => console.log(err)
			),
		[]
	);

	return (
		<Box width="100%">
			<List
				listItemsArray={likedThreads.map((likedThread, _) => (
					<ThreadCardMini
						title={likedThread.title}
						date={dateToString(likedThread.createdAt)}
						initialLikeStatus={likedThread.likeStatus}
						topicsTagged={likedThread.topicsTagged.map(
							(topic: TopicDTO) => topic.name
						)}
						likeCount={likedThread.likeCount}
						contentSummarised={likedThread.contentSummarised}
						initialLikeCount={likedThread.likeCount}
						threadID={likedThread.threadID}
					/>
				))}
				listItemsDataValues={likedThreads.map((likedThread) => String(likedThread.threadID))}
				handleListItemsClick={new Array(profileDataSample.likes.length).fill(
					(event: React.MouseEvent<HTMLElement>) =>
						event.currentTarget.dataset &&
						navigate(`../Thread/${event.currentTarget.dataset.value}`)
				)}
				disablePadding
				disableRipple
				divider
			/>
		</Box>
	);
};

export default LikesPage;
