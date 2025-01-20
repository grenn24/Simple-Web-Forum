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
	expandable?: boolean
}

const Topic = ({ topic , expandable=true}: Prop) => {
	const navigate = useNavigate();
	const screenWidth = useWindowSize().width as number;
	const theme = useTheme();
	const [followStatus, setFollowStatus] = useState(topic.followStatus);
	const [isExpanded, setIsExpanded] = useState(expandable ? false : true);

	return (
		<Box marginBottom={5}>
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
					fontFamily="Poppins"
					fontSize={18}
					fontWeight={450}
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
					sx={{ my: 2 }}
				>
					{topic.threads.filter((_,index)=>isExpanded ? true: index < 3).map((thread) => (
						<Grid
							size={
								screenWidth > theme.breakpoints.values.lg
									? 4
									: screenWidth > theme.breakpoints.values.sm
									? 6
									: 12
							}
							key={thread.threadID}
						>
							<ThreadGridCard thread={thread} style={{height:200}} />
						</Grid>
					))}
				</Grid>
				<Box display={(topic.threads.length > 6 && expandable) ? "flex" : "none"} justifyContent="center">
					<Button fontFamily="Open Sans" fontSize={18} fontWeight={600} handleButtonClick={()=>setIsExpanded(!isExpanded)}>
						{isExpanded ? "View Less" : "View More"}
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Topic;
