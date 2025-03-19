import { Box, Typography, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { get } from "../utilities/api.ts";
import ThreadGridCardsLoading from "../features/Topics/TopicsLoading.tsx";
import { TopicDTO } from "../dtos/TopicDTO";
import { parseTopic, parseTopics } from "../utilities/parseApiResponse";
import Topic from "../features/Topics/Topic.tsx";

const Topics = () => {
	const navigate = useNavigate();

	const { topicID } = useParams();

	const [topicsWithThreads, setTopicsWithThreads] = useState<TopicDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch topics with threads tagged to it from api (re-fetch again when topicID path variable in url is added or changed)
	useEffect(() => {
		setIsLoading(true);
		setTopicsWithThreads([]);
		get(
			`/topics${topicID ? `/${topicID}` : ""}`,
			(res) => {
				const responseBody = res.data.data;
				if (topicID) {
					setTopicsWithThreads([parseTopic(responseBody,true,["public"])]);
				} else {
					setTopicsWithThreads(parseTopics(responseBody,true,["public"]));
				}
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [topicID]);

	return (
		<>
			<Box
				sx={{
					bgcolor: "background.default",
					p: { xs: 1.5, sm: 3 },
					minHeight: "100%",
				}}
				flexGrow={1}
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
					width="100%"
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="text.primary"
					>
						Explore Topics
					</Typography>
				</Box>
				<Box width="100%">
					<Divider />
				</Box>
				<Box
					my={2}
					width="100%"
					display="flex"
					justifyContent="space-between"
				>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="text.primary"
						buttonStyle={{ mx: 0, p: 0 }}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
				</Box>
				<Box
					sx={{
						width: { xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" },
						marginBottom: 3,
					}}
				>
					{/*If website is still fetching data from api, display loading skeleton grid cards instead*/}
					{isLoading && <ThreadGridCardsLoading />}
					{topicsWithThreads.map((topic) => (
						<Topic
							key={topic.topicID}
							topic={topic}
							expandable={topicID ? false : true}
						/>
					))}
				</Box>
			</Box>
		</>
	);
};

export default Topics;
