import { Box, Typography, Avatar } from "@mui/material";
import Button from "../../components/Button";
import Menu from "../../components/Menu";
import {
	ThumbUpOutlined as ThumbUpOutlinedIcon,
	ThumbUpRounded as ThumbUpRoundedIcon,
} from "@mui/icons-material";
import { useState } from "react";
import playerGenerator from "../../utilities/playerGenerator";
import likeSound from "../../assets/audio/like-sound.mp3";

interface Prop {
	id: number;
	author: string;
	authorId: number;
	likeCount: number;
	content: string;
	date: string;
	avatarIconLink: string;
	handleAvatarIconClick: () => void;
}
const Comment = ({
	id,
	author,
	authorId,
	likeCount,
	content,
	date,
	avatarIconLink,
	handleAvatarIconClick,
}: Prop) => {
	const [likeStatus, setLikeStatus] = useState(false);
    	const player = playerGenerator(
				likeSound,
				0.9,
				{ default: [90, 3000] },
				"default"
			);

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Menu
				menuExpandedItemsArray={[]}
				menuIcon={<Avatar src={avatarIconLink} />}
				menuIconStyle={{
					padding: 0,
					"&:hover": {
						filter: "brightness(0.9)",
					},
					marginRight: 1.5,
				}}
				menuIconDataValue="Profile"
				menuExpandedPosition={{
					vertical: "top",
					horizontal: "right",
				}}
				menuExpandedDataValuesArray={[]}
				toolTipText="View Profile"
				showMenuExpandedOnClick={false}
				handleMenuIconClick={handleAvatarIconClick}
			/>
			<Box>
				<Typography fontSize={14} fontWeight={700}>
					{author}
				</Typography>
				<Typography color="primary.dark" fontSize={14}>
					{date}
				</Typography>
			</Box>
			<Typography
				color="text.primary"
				fontSize={14}
				paddingLeft={3}
				lineHeight={1.3}
			>
				{content}
			</Typography>
			<Box display="flex" flexDirection="column">
				<Button
					iconOnly
					buttonIcon={
						likeStatus ? <ThumbUpRoundedIcon /> : <ThumbUpOutlinedIcon />
					}
					color="primary.dark"
					handleButtonClick={() => {setLikeStatus(!likeStatus);
                        player();
                    }}
				/>
				<Typography color="text.dark" fontSize={14} textAlign="center">
					{likeCount}
				</Typography>
			</Box>
		</Box>
	);
};

export default Comment;
