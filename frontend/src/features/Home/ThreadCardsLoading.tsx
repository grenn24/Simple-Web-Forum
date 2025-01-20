import { Box, Grid2 as Grid, Skeleton, useTheme } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";

const ThreadCardsLoading = () => {
	const screenWidth = useWindowSize().width as number;
	const theme = useTheme();
	return (
		<>
			<Box width="100%" my={2.5}>
				<Grid
					container
					columnSpacing={4.5}
					rowSpacing={5}
				>
					{new Array(9).fill("").map((_, index) => (
						<Grid
							key={index}
							size={
								screenWidth > theme.breakpoints.values.lg
									? 4
									: screenWidth > theme.breakpoints.values.sm
									? 6
									: 12
							}
						>
							<Skeleton
								variant="rounded"
								height={200}
								animation="wave"
								width="100%"
							/>
						</Grid>
					))}
				</Grid>
			</Box>
			
		</>
	);
};

export default ThreadCardsLoading;
