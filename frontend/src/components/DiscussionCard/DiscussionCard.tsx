import React, { useState } from "react";
import { DiscussionDTO } from "../../dtos/DiscussionDTO";
import {
	Avatar,
	Box,
	Card,
	CardActionArea,
	SxProps,
	Theme,
	Tooltip,
	Typography,
} from "@mui/material";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { Delete, postJSON } from "../../utilities/api";

interface Prop {
	discussion: DiscussionDTO;
	style?: SxProps<Theme>;
}
const DiscussionCard = ({ discussion, style }: Prop) => {

	const [isRequested, setIsRequested] = useState(discussion.isRequested);
	const navigate = useNavigate();
	const handleRequestJoin = () => {
		setIsRequested(true);
		postJSON(
			`/discussions/${discussion.discussionID}/join-requests/user`,
			{},
			() => {},
			(err) => console.log(err)
		);
	};
	const handleRemoveRequestJoin = () => {
		setIsRequested(false);
		Delete(
			`/discussions/${discussion.discussionID}/join-requests/user`,
			{},
			() => {},
			(err) => console.log(err)
		);
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		if (!discussion.isJoined) {
			isRequested ? handleRemoveRequestJoin() : handleRequestJoin();
		}
	};
	return (
		<Card sx={{ borderRadius: 0.7, ...style }} elevation={3}>
			<CardActionArea
				sx={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
				}}
				onClick={() => navigate(`/Discussions/${discussion.discussionID}`)}
				disableRipple
			>
				<Box height={150} width="100%">
					<img
						src={discussion.BackgroundImageLink}
						width="100%"
						height="100%"
						style={{
							objectFit: "cover",
							display: discussion.BackgroundImageLink ? "block" : "none",
						}}
					/>
				</Box>
				<Box
					p={2}
					flexGrow={1}
					boxSizing="border-box"
					width="100%"
					display="flex"
					flexDirection="column"
					justifyContent="space-between"
				>
					<Box display="flex" flexDirection="column">
						<Typography fontWeight={750} fontSize={22}>
							{discussion.name}
						</Typography>
						<Tooltip title={discussion.creator.username}>
							<Avatar
								src={discussion.creator.avatarIconLink}
								sx={{ width: 23, height: 23 }}
							/>
						</Tooltip>
					</Box>

					<Button
						fullWidth
						variant="contained"
						backgroundColor="primary.dark"
						handleButtonClick={handleButtonClick}
					>
						{discussion.isJoined
							? "View Group"
							: isRequested
							? "Requested"
							: "Join Group"}
					</Button>
				</Box>
			</CardActionArea>
		</Card>
	);
};

export default DiscussionCard;
