import { Box, Skeleton } from '@mui/material';

interface Prop {
	bodyHeight: number
}
const ThreadCardLoading = ({bodyHeight}:Prop) => {
  return (
		<Box>
			<Box display="flex" alignItems="center" height={80}>
				<Box
					display="flex"
					height="100%"
					flexDirection="column"
					justifyContent="center"
					sx={{ mx: 2 }}
				>
					<Skeleton
						variant="circular"
						width={44}
						height={44}
						animation="pulse"
					/>
				</Box>

				<Box
					display="flex"
					flexDirection="column"
					height="80%"
					justifyContent="space-evenly"
					flexGrow={1}
				>
					<Skeleton
						variant="rounded"
						width="85%"
						animation="pulse"
						height={10}
					/>
					<Skeleton
						variant="rounded"
						width="70%"
						animation="pulse"
						height={10}
					/>
				</Box>
			</Box>

			<Skeleton variant="rounded" width="100%" height={bodyHeight} animation="pulse" />

			<Box
				display="flex"
				flexDirection="column"
				height={60}
				justifyContent="space-evenly"
				flexGrow={1}
			>
				<Skeleton variant="rounded" width="100%" animation="pulse" height={10} />
				<Skeleton variant="rounded" width="100%" animation="pulse" height={10} />
			</Box>
		</Box>
	);
}

export default ThreadCardLoading