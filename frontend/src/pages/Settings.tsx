import {
	Box,
	Typography,
	Divider,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import TabMenu from "../components/TabMenu/TabMenu";
import settingsTabMenuLabels from "../features/Settings/settingsTabMenuLabels";
import settingsTabMenuPages from "../features/Settings/settingsTabMenuPages";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";

const Settings = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Typography
				textAlign={"left"}
				fontFamily="Open Sans"
				fontWeight={700}
				fontSize={30}
				color="primary.dark"
				width="100%"
				marginBottom={2}
			>
				Settings
			</Typography>
			<Box width="100%">
				<Divider />
			</Box>
			<Box
				sx={{ marginTop: 2 }}
				width="100%"
				display="flex"
				justifyContent="space-between"
			>
				<Button
					buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
					color="primary.dark"
					buttonStyle={{ mx: 0, p: 0 }}
					handleButtonClick={() => navigate(-1)}
					toolTipText="Back"
				/>
			</Box>

			<Box
				sx={{
					width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
				}}
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<TabMenu
					tabLabelArray={settingsTabMenuLabels}
					tabPageArray={settingsTabMenuPages}
					variant={
						useMediaQuery(theme.breakpoints.up("sm"))
							? "fullWidth"
							: "scrollable"
					}
				/>
			</Box>
		</Box>
	);
};

export default Settings;
