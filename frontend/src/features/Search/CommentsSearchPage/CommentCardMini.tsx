import { Avatar, Box, Paper, Typography } from "@mui/material";
import { CommentDTO } from "../../../dtos/CommentDTO";
import { formatDistanceToNow } from "date-fns";
import { TopicDTO } from "../../../dtos/TopicDTO";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

interface Prop {
	comment: CommentDTO;
}
const CommentCardMini = ({ comment }: Prop) => {
	const navigate = useNavigate();
	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="flex-start"
		>
			<Box display="flex" alignItems="center">
				<Box display="flex" alignItems="center">
					<Avatar
						src={comment.thread.author.avatarIconLink}
						onClick={(event) => {
							event.stopPropagation();
							navigate(`/Profile/${comment.thread.author.authorID}`);
						}}
					/>
					<Typography marginLeft={2} fontSize={17} whiteSpace="pre-wrap">
						{comment.thread.author.username}
						{"  "}•{"  "}
						{formatDistanceToNow(comment.thread.createdAt, { addSuffix: true })}
					</Typography>
				</Box>
			</Box>
			<Typography fontSize={25} fontWeight={700} textAlign="left" width="100%">
				{comment.thread.title}
			</Typography>
			<Box display="flex" marginBottom={1}>
				{comment.thread.topicsTagged.map((topic: TopicDTO) => (
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
			<Box width="100%">
				<Paper
					sx={{
						backgroundColor: "rgb(197, 197, 197)",
						p: 1.5,
						marginBottom: 1,
					}}
				>
					<Box display="flex" alignItems="center">
						<Box display="flex" alignItems="center">
							<Avatar
								src={comment.author.avatarIconLink}
								onClick={(event) => {
									event.stopPropagation();
									navigate(`/Profile/${comment.author.authorID}`);
								}}
							/>
							<Typography
								marginLeft={2}
								fontSize={17}
								color="text.primary"
								whiteSpace="pre-wrap"
							>
								{comment.author.username}
								{"  "}•{"  "}
								{formatDistanceToNow(comment.createdAt, {
									addSuffix: true,
								})}
							</Typography>
						</Box>
					</Box>
					<Typography>{comment.content}</Typography>
				</Paper>
			</Box>

			<Typography
				fontSize={15}
				fontFamily="Open Sans"
				fontWeight={400}
				whiteSpace="pre-wrap"
			>
				{comment.thread.likeCount} Likes • {comment.thread.commentCount}{" "}
				Comments
			</Typography>
		</Box>
	);
};

export default CommentCardMini;
