import { Box, Grid2 as Grid, Skeleton, useTheme } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";

const ThreadGridCardsLoading = () => {
	const screenWidth = useWindowSize().width as number;
	const theme = useTheme();
	return (
		<>
			<Box width="100%" marginBottom={8} marginTop={5}>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Skeleton variant="rounded" width={200} height={30} />
					<Skeleton variant="rounded" width={100} height={20} />
				</Box>
				<Grid
					container
					columnSpacing={2.5}
					rowSpacing={2}
					sx={{ marginTop: 2 }}
				>
					{new Array(3).fill(
						<Grid
							size={
								screenWidth > theme.breakpoints.values.md
									? 4
									: screenWidth > theme.breakpoints.values.sm
									? 6
									: 12
							}
						>
							<Skeleton
								variant="rounded"
								height={180}
								animation="pulse"
								width="100%"
							/>
						</Grid>
					)}
				</Grid>
			</Box>
			<Box width="100%">
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Skeleton variant="rounded" width={200} height={30} />
					<Skeleton variant="rounded" width={100} height={20} />
				</Box>
				<Grid
					container
					columnSpacing={2.5}
					rowSpacing={2}
					sx={{ marginTop: 2 }}
				>
					{new Array(3).fill(
						<Grid
							size={
								screenWidth > theme.breakpoints.values.md
									? 4
									: screenWidth > theme.breakpoints.values.sm
									? 6
									: 12
							}
						>
							<Skeleton
								variant="rounded"
								height={180}
								animation="pulse"
								width="100%"
							/>
						</Grid>
					)}
				</Grid>
			</Box>
		</>
	);
};

export default ThreadGridCardsLoading;
