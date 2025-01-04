import { Box, Divider, Typography } from '@mui/material';
import React from 'react'
import Button from "../../../components/Button";
import { CommentDTO } from '../../../dtos/CommentDTO';
import { dateToTimeYear, dateToYear } from '../../../utilities/dateToString';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteForeverRounded as DeleteForeverRoundedIcon} from '@mui/icons-material';
import { Delete } from '../../../utilities/apiClient';

interface Prop {
    comment: CommentDTO;
    setComments: (comments : CommentDTO[]) => void;
    comments: CommentDTO[]
}

const ThreadCardMini = ({ comment, setComments, comments}: Prop) => {
    const navigate = useNavigate();
	const { authorID } = useParams();
  return (
		<Box key={comment.commentID}>
			<Box display="flex" justifyContent="space-between">
				<Typography fontFamily="Open Sans" fontSize={22} fontWeight={600}>
					{comment.thread.title}
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
						{comment.thread.author.name}
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
						{dateToYear(comment.thread.createdAt, "long")}
					</Typography>
				</Box>
			</Box>
			<Typography
				variant="h6"
				color="text.secondary"
				fontFamily="Open Sans"
				fontSize={18}
			>
				{comment.thread.topicsTagged.map((topic) => {
					return (
						<Button
							key={topic.topicID}
							disableRipple
							handleButtonClick={(event: React.MouseEvent<HTMLElement>) => {
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
			<Typography marginTop={2} fontSize={17}>
				{comment.thread.content}
			</Typography>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				marginTop={2}
			>
				<Box display="flex">
					<Typography fontSize={17} marginRight={1.7} fontWeight={750}>
						You Replied:
					</Typography>
					<Typography fontSize={17}>{comment.content}</Typography>
				</Box>
				<Box display="flex" alignItems="center">
					<Typography
						fontFamily="Open Sans"
						fontSize={15}
						fontWeight={600}
						fontStyle="text.secondary"
					>
						{dateToTimeYear(comment.createdAt, "short")}
					</Typography>
					{authorID === "User" && (
						<Button
							toolTipText="Delete Comment"
							color="primary.dark"
							buttonIcon={<DeleteForeverRoundedIcon sx={{ fontSize: 27 }} />}
							buttonStyle={{ p: 0 }}
							handleButtonClick={(event: React.MouseEvent<HTMLElement>) => {
								event.stopPropagation();
								setComments(
									comments.filter(
										(commentInArray: CommentDTO) =>
											commentInArray.commentID != comment.commentID
									)
								);
								Delete(
									`/comments/${comment.commentID}`,
									() => {},
									(err) => console.log(err)
								);
							}}
						/>
					)}
				</Box>
			</Box>
		</Box>
	);
}

export default ThreadCardMini