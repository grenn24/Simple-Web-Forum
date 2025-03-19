import { Box, Divider, Skeleton, Typography, useTheme } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import ThreadCard from "../components/ThreadCard";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { get } from "../utilities/api";
import { parseThreads, parseTopics } from "../utilities/parseApiResponse";
import { ThreadDTO } from "../dtos/ThreadDTO";
import TrendingTopics from "../features/Home/TrendingTopics";
import { TopicDTO } from "../dtos/TopicDTO";
import ThreadCardsLoading from "../features/Home/ThreadCardsLoading";
import { useAppSelector } from "../utilities/redux";

const Home = () => {
	const screenWidth = useWindowSize().width as number;
	const theme = useTheme();
	const [isLoading, setIsLoading] = useState(true);
	const [trendingThreads, setTrendingThreads] = useState<ThreadDTO[]>([]);
	const [trendingTopics, setTrendingTopics] = useState<TopicDTO[]>([]);
	const { username } = useAppSelector((state) => ({
		username: state.userInfo.username,
	}));
	useEffect(() => {
		get(
			"/threads/trending",
			(res) => {
				const responseBody = res.data.data;
				setTrendingThreads(parseThreads(responseBody, true, ["public"]));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
		get(
			"/topics/trending",
			(res) => {
				const responseBody = res.data.data;
				setTrendingTopics(parseTopics(responseBody, true, ["public"]));
			},
			(err) => console.log(err)
		);
	}, []);
	return (
		<Box
			sx={{
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			flexGrow={1}
			position="absolute"
			width="100%"
			boxSizing="border-box"
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
					Welcome Back, {username}
				</Typography>
				<Box width="100%" my={2}>
					<Divider />
				</Box>
				<Typography
					fontFamily="Open Sans"
					color="text.primary"
					fontSize={21}
					fontWeight={700}
					marginRight={3}
				>
					Trending Topics
				</Typography>
				{isLoading ? (
					<Grid container columnSpacing={5}>
						<Grid size={4}>
							<Skeleton height={46} animation="wave" />
						</Grid>
						<Grid size={4}>
							<Skeleton height={46} animation="wave" />
						</Grid>
						<Grid size={4}>
							<Skeleton height={46} animation="wave" />
						</Grid>
					</Grid>
				) : (
					<TrendingTopics topics={trendingTopics} />
				)}
				<br />
				<Typography
					textAlign={"left"}
					fontFamily="Open Sans"
					fontWeight={700}
					fontSize={21}
					marginBottom={1.5}
					color="text.primary"
				>
					Trending Threads
				</Typography>
				{isLoading ? (
					<ThreadCardsLoading />
				) : (
					<Grid container columnSpacing={5} rowSpacing={6}>
						{trendingThreads.map((thread) => (
							<Grid
								size={
									screenWidth > theme.breakpoints.values.lg
										? 4
										: screenWidth > theme.breakpoints.values.sm
										? 6
										: 12
								}
							>
								<ThreadCard
									thread={thread}
									handleDeleteThread={(threadID) => {
										setTrendingThreads(
											trendingThreads.filter(
												(thread) => thread.threadID !== threadID
											)
										);
										setTrendingTopics(
											trendingTopics
												.map((topic) => {
													topic.threads = topic.threads.filter(
														(thread) => thread.threadID !== threadID
													);
													return topic;
												})
												.filter((topic: any) => topic.threads.length != 0)
										);
									}}
								/>
							</Grid>
						))}
					</Grid>
				)}
			</Box>
		</Box>
	);
};

export default Home;
