import { Box, Typography, Divider, Container } from "@mui/material";
import TabMenu from "../components/TabMenu/TabMenu";
import settingsTabMenuLabels from "../features/Settings/settingsTabMenuLabels";
import settingsTabMenuPages from "../features/Settings/settingsTabMenuPages";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";

const Settings = () => {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
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
					Settings
				</Typography>
			</Box>
			<Divider />
			<Box marginTop={2}>
				<Button
					buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
					color="primary.dark"
					buttonStyle={{ mx: 0, p: 0.5 }}
					handleButtonClick={() => navigate(-1)}
					toolTipText="Back"
				/>
			</Box>
			<Container
				sx={{
					width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
					my: 5,
				}}
				disableGutters
			>
				<TabMenu
					tabLabelArray={settingsTabMenuLabels}
					tabPageArray={settingsTabMenuPages}
					variant="scrollable"
				/>
			</Container>
		</Box>
	);
};

export default Settings;
