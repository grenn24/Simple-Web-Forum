import { Box, LinearProgress, Typography } from '@mui/material'

interface Prop {
    progress: number
}

const LinearProgressWithLabel = ({progress} : Prop) => {
  return (
		<Box width="100%" display="flex" alignItems="center">
			<Box flexGrow={1}>
				<LinearProgress variant="determinate" value={progress} />
			</Box>

			<Typography marginLeft={1} fontSize={15}>{`${Math.round(
				progress
			)}%`}</Typography>
		</Box>
	);
}

export default LinearProgressWithLabel