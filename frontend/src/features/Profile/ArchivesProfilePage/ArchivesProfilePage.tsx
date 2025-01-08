import { Box, CircularProgress, Typography} from "@mui/material";
import List from "../../../components/List";
import { useNavigate, useParams } from "react-router-dom";
import ThreadCardMini from "./ThreadCardMini";
import { useState, useEffect } from "react";
import { get } from "../../../utilities/apiClient";
import ArchiveDTO from "../../../dtos/ArchiveDTO";
import { parseArchives } from "../../../utilities/parseApiResponse";



const RemovedPage = () => {
	const navigate = useNavigate();
	const [archives, setArchives] = useState<ArchiveDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { authorID } = useParams();

	useEffect(
		() =>
			get(
				`/authors/${authorID === "User" ? "user" : authorID}/archives`,
				(res) => {
					const responseBody = res.data.data;
					const archives = parseArchives(responseBody);
					setArchives(archives);
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[]
	);
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			{isLoading ? (
				<CircularProgress size={70} />
			) : archives.length !== 0 ? (
				<>
					<Box width="97%" marginBottom={0.5}>
						<Typography textAlign="left" fontFamily="Open Sans" fontSize={22}>
							{archives.length} Archived Threads
						</Typography>
					</Box>
					<List
						listStyle={{ width: "100%" }}
						listItemsArray={archives.map((archive) => (
							<ThreadCardMini
								thread={archive.thread}
								archives={archives}
								setArchives={setArchives}
							/>
						))}
						listItemsDataValues={archives.map((archive, _) =>
							String(archive.thread.threadID)
						)}
						handleListItemsClick={new Array(archives.length).fill(
							(event: React.MouseEvent<HTMLElement>) =>
								event.currentTarget.dataset &&
								navigate(`../Thread/${event.currentTarget.dataset.value}`)
						)}
						listItemTextStyle={{ flexGrow: 1 }}
						listItemPadding={1.4}
						disableRipple
						divider
					/>
				</>
			) : (
				<Typography
					marginTop={4}
					fontStyle="primary.dark"
					fontFamily="Open Sans"
					fontSize={17}
				>
					No archives yet
				</Typography>
			)}
		</Box>
	);
};

export default RemovedPage;
