import React from "react";
import { Box, Container, Divider, Typography } from "@mui/material";

const Profile = () => {
	return (
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
					Profile
				</Typography>
			</Box>
			<Divider />
			<Container
				sx={{
					width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
					my: 5,
				}}
				disableGutters
			></Container>
		</Box>
	);
};

export default Profile;
