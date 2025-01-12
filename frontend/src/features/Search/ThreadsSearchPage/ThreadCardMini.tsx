
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { Avatar, Box, Typography } from "@mui/material";
import { TopicDTO } from "../../../dtos/TopicDTO";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";

interface Prop {
	thread: ThreadDTO;
}
const ThreadCardMini = ({ thread }: Prop) => {
	const navigate = useNavigate();
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box
				flexGrow={1}
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				marginRight={2}
			>
				<Box display="flex" alignItems="center">
					<Box display="flex" alignItems="center">
						<Avatar
							src={thread.author.avatarIconLink}
							onClick={(event) => {
								event.stopPropagation();
								navigate(`/Profile/${thread.author.authorID}`);
							}}
						/>
						<Typography marginLeft={2} fontSize={17} whiteSpace="pre-wrap">
							{thread.author.username}
							{"  "}•{"  "}
							{formatDistanceToNow(thread.createdAt, { addSuffix: true })}
						</Typography>
					</Box>
				</Box>
				<Typography fontSize={25} fontWeight={700}>
					{thread.title}
				</Typography>
				<Box display="flex" marginBottom={1}>
					{thread.topicsTagged.map((topic: TopicDTO) => (
						<Button
							key={topic.topicID}
							disableRipple
							handleButtonClick={(event) => {
								event.stopPropagation();
								navigate(`/Topics/${topic.topicID}`);
							}}
							fontFamily="Open Sans"
							fontSize={13}
							buttonStyle={{
								px: 1,
								py: 0,
								marginLeft: 0,
								marginRight: 1.5,
							}}
							color="text.secondary"
							variant="outlined"
							backgroundColor="primary.light"
						>
							{topic.name}
						</Button>
					))}
				</Box>
				<Typography
					fontSize={15}
					fontFamily="Open Sans"
					fontWeight={400}
					whiteSpace="pre-wrap"
				>
					{thread.likeCount} Likes • {thread.commentCount} Comments
				</Typography>
			</Box>
			{thread.imageLink.length !== 0 && (
				<img
					width="20%"
					height={120}
					style={{ objectFit: "cover" }}
					src={thread.imageLink[0]}
				/>
			)}
		</Box>
	);
};

export default ThreadCardMini;
