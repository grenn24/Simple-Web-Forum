import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import Button from "../../../components/Button";
import { TopicDTO } from "../../../dtos/TopicDTO";
import { Box, Typography } from "@mui/material";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { dateToTimeYear } from "../../../utilities/dateToString";
import { useNavigate, useParams } from "react-router-dom";
import { Delete } from "../../../utilities/apiClient";

interface Prop {
	thread: ThreadDTO;
    threads: ThreadDTO[];
    setThreads: (threads: ThreadDTO[]) => void
}
const ThreadCardMini = ({ thread, threads, setThreads }: Prop) => {
	const navigate = useNavigate();
	const { authorID } = useParams();
	return (
		<Box key={thread.threadID}>
			<Typography fontFamily="Open Sans" fontSize={22} fontWeight={600}>
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
								setThreads(
									threads.filter((t) => t.threadID !== thread.threadID)
								);
								Delete(
									`/threads/${thread.threadID}`,
									{},
									() => {},
									(err) => console.log(err)
								);
							}}
							buttonStyle={{ marginLeft: 1, p: 0 }}
						/>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default ThreadCardMini;
