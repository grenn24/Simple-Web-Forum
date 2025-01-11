import { useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState } from "react";
import { Box, Grid2 as Grid, Typography, useTheme } from "@mui/material";
import Button from "../../components/Button";
import {
	NotificationsActiveRounded as NotificationsActiveRoundedIcon,
	NotificationsNoneRounded as NotificationsNoneRoundedIcon,
} from "@mui/icons-material";
import { Delete, postJSON } from "../../utilities/api";
import ThreadGridCard from "../../components/ThreadGridCard/ThreadGridCard";
import { TopicDTO } from "../../dtos/TopicDTO";

interface Prop {
	topic: TopicDTO;
}

const Topic = ({ topic }: Prop) => {
	const navigate = useNavigate();
	const screenWidth = useWindowSize().width as number;
	const theme = useTheme();
	const [followStatus, setFollowStatus] = useState(topic.followStatus);

	return (
		<Box marginBottom={8} marginTop={5}>
			<Box display="flex" alignItems="center" justifyContent="space-between">
				<Typography
					variant="h5"
					fontFamily="Open Sans"
					color="primary.dark"
					fontWeight={700}
					onClick={() => navigate(`../Topics/${topic.topicID}`)}
					sx={{ cursor: "pointer" }}
				>
					{topic.name}
				</Typography>
				<Button
					buttonStyle={{ py: 0 }}
					borderRadius={40}
					fontSize={20}
					buttonIcon={
						followStatus ? (
							<NotificationsActiveRoundedIcon />
						) : (
							<NotificationsNoneRoundedIcon />
						)
					}
					handleButtonClick={() => {
						if (followStatus) {
							Delete(
								"/follows/user",
								{ followee_topic_id: topic.topicID },
								(err) => console.log(err)
							);
						} else {
							postJSON(
								"/follows/user",
								{ followee_topic_id: topic.topicID },
								(err) => console.log(err)
							);
						}
						setFollowStatus(!followStatus);
					}}
				>
					Follow
				</Button>
			</Box>

			<Box>
				<Grid
					container
					columnSpacing={2.5}
					rowSpacing={2}
					sx={{ marginTop: 2 }}
				>
					{topic.threads.map((thread) => (
						<Grid
							size={
								screenWidth > theme.breakpoints.values.md
									? 4
									: screenWidth > theme.breakpoints.values.sm
									? 6
									: 12
							}
							key={thread.threadID}
						>
							<ThreadGridCard thread={thread} />
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default Topic;
