import {Box, Grid2 as Grid, Typography, Divider, useTheme} from "@mui/material";
import ThreadGridCard from "../features/Topics/ThreadGridCard";
import { useNavigate } from "react-router-dom";
import threadGroups from "../features/Topics/threadGroups";
import { useWindowSize } from "@uidotdev/usehooks";

const Topics = () => {
	const navigate = useNavigate();
	const screenWidth = useWindowSize().width as number;
	return (
		<>
			<Box
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: 3,
					minHeight: "100%",
				}}
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
				{threadGroups.map((threadGroup) => (
					<Box marginBottom={10} key={threadGroup.topic}>
						<Box
							sx={{
								marginX: "auto",
								width: {
									xs: "100%",
									sm: "100%",
									md: "95%",
									lg: "85%",
									xl: "70%",
								},
								marginTop: 3,
							}}
						>
							<Typography
								variant="h5"
								fontFamily="Open Sans"
								color="primary.dark"
								fontWeight={700}
							>
								{threadGroup.topic}
							</Typography>
							<Box>
								<Grid
									container
									columnSpacing={2.5}
									rowSpacing={2}
									sx={{ marginTop: 2 }}
								>
									{threadGroup.threads.map((thread) => (
										<Grid
											size={
												screenWidth > useTheme().breakpoints.values.md
													? 4
													: screenWidth > useTheme().breakpoints.values.sm
													? 6
													: 12
											}
											key={thread.id}
										>
											<ThreadGridCard
												threadAuthor={thread.author}
												threadTitle={thread.title}
												threadDate={thread.date}
												avatarIconLink={thread.avatarIconLink}
												threadContentSummarised={thread.contentSummarised}
												avatarClickHandlerFunction={() => {
													navigate("../Profile");
												}}
											/>
										</Grid>
									))}
								</Grid>
							</Box>
						</Box>
					</Box>
				))}
			</Box>
		</>
	);
};

export default Topics;
