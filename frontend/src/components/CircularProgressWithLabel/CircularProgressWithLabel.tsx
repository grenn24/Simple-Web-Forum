import { Box, CircularProgress, Typography } from '@mui/material';


interface Prop {
    progress : number; 
}
const CircularProgressWithLabel = ({progress} : Prop) => {
  return (
		<Box sx={{ position: "relative", display: "inline-flex" }}>
			<CircularProgress variant="determinate" value={progress}/>
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: "absolute",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography
					variant="caption"
					component="div"
					sx={{ color: "text.secondary" }}
				>{`${Math.round(progress)}%`}</Typography>
			</Box>
		</Box>
	);
}

export default CircularProgressWithLabel