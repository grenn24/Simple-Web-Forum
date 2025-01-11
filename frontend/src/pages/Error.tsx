import { Box, Typography } from "@mui/material";

const Error = () => {
	return (
		<Box width="100vw" height="100vh">
			<Typography fontFamily="Open Sans" fontSize={30}>
				This page is not available. You may have typed the wrong link.
			</Typography>
			<br />
			<Typography fontFamily="Open Sans" fontSize={25}>
				Go back to <a href="/">NUS Gossips</a>
			</Typography>
		</Box>
	);
};

export default Error;
