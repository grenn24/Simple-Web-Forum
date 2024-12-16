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
import { useState } from "react";

interface Prop {
	title: string;
	date: string;
	initialLikeStatus: boolean;
	topicsTagged: string[];
	likeCount: number;
	contentSummarised: string;
}
const ThreadCardMini = ({
	title,
	date,
	initialLikeStatus,
	topicsTagged,
	likeCount,
	contentSummarised,
}: Prop) => {
	const [likeStatus, setLikeStatus] = useState(initialLikeStatus);
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
					fontSize={13}
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
					setLikeStatus(!likeStatus);
					!likeStatus && player();
					event.stopPropagation();
				}}
				fontSize={14}
			>
				{likeCount}
			</Button>
		</>
	);
};
const LikesPage = () => {
	const navigate = useNavigate();

	return (
		<Box width="100%">
			<List
				listItemsArray={profileDataSample.likes.map((post, _) => (
					<ThreadCardMini
						title={post.title}
						date={post.date}
						initialLikeStatus={post.likeStatus}
						topicsTagged={post.topicsTagged}
						likeCount={post.likeCount}
						contentSummarised={post.contentSummarised}
					/>
				))}
				listItemsDataValues={profileDataSample.likes.map((post, _) =>
					String(post.id)
				)}
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
