import { Box, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import Button from "../../../components/Button";
import { CommentDTO } from "../../../dtos/CommentDTO";
import {  dateToYear } from "../../../utilities/dateToString";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteForeverRounded as DeleteForeverRoundedIcon } from "@mui/icons-material";
import { Delete } from "../../../utilities/api";
import Snackbar from "../../../components/Snackbar";
import SimpleDialog from "../../../components/SimpleDialog";
import List from "../../../components/List";
import { formatDistanceToNow } from "date-fns";
import RichTextField from "../../../components/RichTextField";

interface Prop {
	comment: CommentDTO;
	setComments: (comments: CommentDTO[]) => void;
	comments: CommentDTO[];
}

const ThreadCardMini = ({ comment, setComments, comments }: Prop) => {
	const navigate = useNavigate();
	const { authorID } = useParams();
	const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
	const [openDeleteCommentSnackbar, setOpenDeleteCommentSnackbar] =
		useState(false);
	const handleDeleteComment = (event: React.MouseEvent<HTMLElement>) => {
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
		setOpenDeleteCommentDialog(false);
	};
	return (
		<Box key={comment.commentID}>
			<Box display="flex" justifyContent="space-between">
				<Typography
					fontSize={22}
					fontWeight={760}
					color="primary.dark"
				>
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
			<Box marginTop={2} fontSize={15} fontWeight={400}>
				<RichTextField
					editorState={comment.thread.content}
					showBorders={false}
					editable={false}
				/>
			</Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				marginTop={2}
			>
				<Box display="flex">
					<Typography fontSize={17} marginRight={1.7} fontWeight={750}>
						{authorID === "User" ? "You" : comment.author.name} Replied:
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
						{formatDistanceToNow(comment.createdAt, {
							addSuffix: true,
						})}
					</Typography>
					{authorID === "User" && (
						<Button
							toolTipText="Delete Comment"
							color="primary.dark"
							buttonIcon={<DeleteForeverRoundedIcon sx={{ fontSize: 27 }} />}
							buttonStyle={{ p: 0, marginLeft: 1 }}
							handleButtonClick={(event) => {
								event.stopPropagation();
								setOpenDeleteCommentDialog(true);
							}}
						/>
					)}
				</Box>
			</Box>
			{/*Confirm Delete Comment Dialog*/}
			<SimpleDialog
				openDialog={openDeleteCommentDialog}
				setOpenDialog={setOpenDeleteCommentDialog}
				title="Confirm Comment Deletion"
				backdropBlur={5}
				borderRadius={1.3}
				dialogTitleHeight={55}
				width={400}
			>
				<List
					listItemsArray={["Yes", "No"]}
					divider
					handleListItemsClick={[
						handleDeleteComment,
						(event) => {
							event.stopPropagation();
							setOpenDeleteCommentDialog(false);
						},
					]}
				/>
			</SimpleDialog>
			{/*Comment deleted snackbar*/}
			<Snackbar
				openSnackbar={openDeleteCommentSnackbar}
				setOpenSnackbar={setOpenDeleteCommentSnackbar}
				message="Comment deleted"
				duration={2000}
				undoButton={false}
			/>
		</Box>
	);
};

export default ThreadCardMini;
