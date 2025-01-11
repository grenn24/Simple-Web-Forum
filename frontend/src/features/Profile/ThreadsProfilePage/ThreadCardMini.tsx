import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import Button from "../../../components/Button";
import { TopicDTO } from "../../../dtos/TopicDTO";
import { Box, Typography } from "@mui/material";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { dateToTimeYear } from "../../../utilities/dateToString";
import { useNavigate, useParams } from "react-router-dom";
import { Delete } from "../../../utilities/api";
import SimpleDialog from "../../../components/SimpleDialog";
import List from "../../../components/List";
import { useState } from "react";
import Snackbar from "../../../components/Snackbar";

interface Prop {
	thread: ThreadDTO;
	threads: ThreadDTO[];
	setThreads: (threads: ThreadDTO[]) => void;
}
const ThreadCardMini = ({ thread, threads, setThreads }: Prop) => {
	const navigate = useNavigate();
	const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState(false);
	const [openDeleteThreadSnackbar, setOpenDeleteThreadSnackbar] =
		useState(false);
	const { authorID } = useParams();

	return (
		<Box key={thread.threadID}>
			<Typography
				fontFamily="Open Sans"
				fontSize={22}
				fontWeight={600}
				marginBottom={1.7}
			>
				{thread.title}
			</Typography>

			<Typography
				variant="h6"
				color="text.secondary"
				fontFamily="Open Sans"
				fontSize={18}
			>
				{thread.topicsTagged.map((topic: TopicDTO) => {
					return (
						<Button
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
							key={topic.topicID}
						>
							{topic.name}
						</Button>
					);
				})}
			</Typography>
			<Typography fontSize={17} marginTop={2}>
				{thread.content}
			</Typography>
			<Box>
				<Box display="flex" alignItems="center" justifyContent="flex-end">
					<Typography
						fontFamily="Open Sans"
						fontSize={15}
						fontWeight={600}
						fontStyle="text.secondary"
					>
						{dateToTimeYear(thread.createdAt, "short")}
					</Typography>
					{authorID === "User" && (
						<Button
							toolTipText="Delete Thread"
							color="primary.dark"
							buttonIcon={<DeleteForeverRoundedIcon sx={{ fontSize: 27 }} />}
							handleButtonClick={(event) => {
								event.stopPropagation();
								setOpenDeleteThreadDialog(true);
							}}
							buttonStyle={{ marginLeft: 1, p: 0 }}
						/>
					)}
				</Box>
			</Box>
			{/*Confirm Delete Thread Dialog*/}
			<SimpleDialog
				openDialog={openDeleteThreadDialog}
				setOpenDialog={setOpenDeleteThreadDialog}
				title="Confirm Thread Deletion"
				backdropBlur={5}
				borderRadius={1.3}
				dialogTitleHeight={55}
				width={400}
			>
				<List
					listItemsArray={["Yes", "No"]}
					divider
					handleListItemsClick={[
						(event) => {
							event.stopPropagation();
							setThreads(threads.filter((t) => t.threadID !== thread.threadID));
							Delete(
								`/threads/${thread.threadID}`,
								{},
								() => {},
								(err) => console.log(err)
							);
							setOpenDeleteThreadDialog(false);
						},
						(event) => {
							event.stopPropagation();
							setOpenDeleteThreadDialog(false);
						},
					]}
				/>
			</SimpleDialog>
			{/*Thread deleted snackbar*/}
			<Snackbar
				openSnackbar={openDeleteThreadSnackbar}
				setOpenSnackbar={setOpenDeleteThreadSnackbar}
				message="Thread deleted"
				duration={2000}
				undoButton={false}
			/>
		</Box>
	);
};

export default ThreadCardMini;
