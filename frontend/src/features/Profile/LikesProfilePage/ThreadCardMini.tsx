import { Box, Divider, Typography } from "@mui/material";
import { dateToTimeYear, dateToYear } from "../../../utilities/dateToString";
import LikeDTO from "../../../dtos/LikeDTO";
import { useState } from "react";
import playerGenerator from "../../../utilities/playerGenerator";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { Delete, postJSON } from "../../../utilities/apiClient";
import likeSound from "../../../assets/audio/like-sound.mp3";

import {
	FavoriteRounded as FavoriteRoundedIcon,
	FavoriteBorderRounded as FavoriteBorderRoundedIcon,
} from "@mui/icons-material";

interface Prop {
	like: LikeDTO
}
const ThreadCardMini = ({ like }: Prop) => {
	const [likeStatus, setLikestatus] = useState(like.thread.likeStatus);
	const [likeCount, setCount] = useState(like.thread.likeCount);
	const player = playerGenerator(
		likeSound,
		0.9,
		{ default: [90, 3000] },
		"default"
	);
	const navigate = useNavigate();
	const {authorID} = useParams();

	return (
		<Box key={like.likeID}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Typography fontFamily="Open Sans" fontSize={22} fontWeight={600}>
					{like.thread.title}
				</Typography>
				<Box display="flex" flexDirection="column">
					<Typography
						fontFamily="Open Sans"
						fontSize={15}
						fontWeight={600}
						fontStyle="text.secondary"
						width="100%"
						textAlign="right"
					>
						{like.thread.author.name}
					</Typography>
					<Divider />
					<Typography
						fontFamily="Open Sans"
						fontSize={15}
						fontWeight={600}
						fontStyle="text.secondary"
						width="100%"
						textAlign="right"
					>
						{dateToYear(like.thread.createdAt, "long")}
					</Typography>
				</Box>
			</Box>
			<Typography
				variant="h6"
				color="text.secondary"
				fontFamily="Open Sans"
				fontSize={18}
			>
				{like.thread.topicsTagged.map((topic) => {
					return (
						<Button
							key={topic.topicID}
							disableRipple
							handleButtonClick={(event) => {
								event.stopPropagation();
								navigate(`../Topics/${topic.topicID}`);
							}}
							fontFamily="Open Sans"
							buttonStyle={{ px: 1, py: 0, marginRight: 1 }}
							color="text.secondary"
							fontSize={12}
							variant="outlined"
							backgroundColor="primary.light"
						>
							{topic.name}
						</Button>
					);
				})}
			</Typography>
			<Typography marginTop={2} marginBottom={1} fontSize={17}>
				{like.thread.content}
			</Typography>
			<Box display="flex" justifyContent="space-between" alignItems="center">
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
					disabled={authorID!=="User"}
					handleButtonClick={(event) => {
						event.stopPropagation();
						setLikestatus(!likeStatus);
						if (likeStatus) {
							setCount(likeCount - 1);
							Delete(
								`/threads/${like.thread.threadID}/likes/user`,
								{},
								() => {},
								(err) => console.log(err)
							);
						} else {
							player();
							setCount(likeCount + 1);
							postJSON(
								`/threads/${like.thread.threadID}/likes/user`,
								{},
								() => {},
								(err) => console.log(err)
							);
						}
					}}
					fontSize={14}
				>
					{String(likeCount)}
				</Button>
				<Typography
					fontFamily="Open Sans"
					fontSize={15}
					fontWeight={600}
					fontStyle="text.secondary"
				>
					{dateToTimeYear(like.createdAt, "short")}
				</Typography>
			</Box>
		</Box>
	);
};

export default ThreadCardMini;