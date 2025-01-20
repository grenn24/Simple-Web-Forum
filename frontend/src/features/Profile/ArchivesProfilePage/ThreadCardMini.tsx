import { useNavigate, useParams } from "react-router-dom";
import ArchiveDTO from "../../../dtos/ArchiveDTO";
import { ThreadDTO } from "../../../dtos/ThreadDTO";
import { Box, Typography } from "@mui/material";
import Button from "../../../components/Button";
import { dateToTimeYear } from "../../../utilities/dateToString";
import { Delete } from "../../../utilities/api";
import UnarchiveRoundedIcon from "@mui/icons-material/UnarchiveRounded";
import RichTextField from "../../../components/RichTextField";

interface Prop {
	thread: ThreadDTO;
	archives: ArchiveDTO[];
	setArchives: (archives: ArchiveDTO[]) => void;
}

const ThreadCardMini = ({ thread, archives, setArchives }: Prop) => {
	const navigate = useNavigate();
	const { authorID } = useParams();
	return (
		<Box key={thread.threadID}>
			<Typography fontFamily="Open Sans" fontSize={22} fontWeight={760}  color="primary.dark">
				{thread.title}
			</Typography>

			<Typography
				variant="h6"
				color="text.secondary"
				fontFamily="Open Sans"
				fontSize={18}
			>
				{thread.topicsTagged.map((topic) => {
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
			<Typography marginTop={2} fontSize={15} fontWeight={400}>
				<RichTextField
					editorState={thread.content}
					showBorders={false}
					editable={false}
				/>
			</Typography>
			<Box display="flex" justifyContent="flex-end" alignItems="center">
				<Typography
					fontFamily="Open Sans"
					fontSize={15}
					fontWeight={600}
					fontStyle="text.secondary"
				>
					{dateToTimeYear(thread.createdAt, "long")}
				</Typography>
				{authorID === "User" && (
					<Button
						toolTipText="Unarchive Thread"
						color="primary.dark"
						buttonIcon={<UnarchiveRoundedIcon sx={{ fontSize: 24 }} />}
						handleButtonClick={(event) => {
							event.stopPropagation();
							setArchives(
								archives.filter(
									(archive: ArchiveDTO) =>
										archive.thread.threadID !== thread.threadID
								)
							);
							Delete(
								`/threads/${thread.threadID}/archives/user`,
								{},
								() => {},
								(err) => console.log(err)
							);
						}}
					/>
				)}
			</Box>
		</Box>
	);
};

export default ThreadCardMini;
