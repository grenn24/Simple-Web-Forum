import { Box, Typography, Divider, Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { get } from "../utilities/apiClient";
import ThreadGridCardsLoading from "../features/Topics/ThreadGridCardsLoading";
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
			`/topics${topicID ? `/${topicID}` : ""}/threads`,
			(res) => {
				const responseBody = res.data.data;
				if (topicID) {
					setTopicsWithThreads([parseTopic(responseBody)]);
				} else {
					setTopicsWithThreads(parseTopics(responseBody));
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
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="primary.dark"
					>
						Explore Topics
					</Typography>
				</Box>
				<Divider />
				<Box marginTop={2}>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0, p: 0 }}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
				</Box>
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" },
						marginBottom: 3,
					}}
					disableGutters
				>
					{/*If website is still fetching data from api, display loading skeleton grid cards instead*/}
					{isLoading && <ThreadGridCardsLoading />}
					{topicsWithThreads.map((topic) => (
						<Topic key={topic.topicID} topic={topic} />
					))}
				</Container>
			</Box>
		</>
	);
};

export default Topics;
