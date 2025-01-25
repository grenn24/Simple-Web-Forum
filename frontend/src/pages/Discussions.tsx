import { Box, Divider, Typography } from "@mui/material";
import Button from "../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
} from "@mui/icons-material";
import DynamicDrawer from "../components/DynamicDrawer";
import DiscoverPage from "../features/Discussions/DiscoverPage";
import drawerItemTextArray from "../features/Discussions/drawerItemTextArray";
import drawerItemIconArray from "../features/Discussions/drawerItemIconArray";
import DiscussionsJoinedPage from "../features/Discussions/DiscussionsJoinedPage";
import DiscussionsCreatedPage from "../features/Discussions/DiscussionsCreatedPage";

const Discussions = () => {
	const navigate = useNavigate();
	const [searchParams, _] = useSearchParams();
	const type = searchParams.get("type");
	let currentPageIndex = 0;
	drawerItemTextArray.forEach((label, index) => {
		if (label === type) {
			currentPageIndex = index;
		}
	});
	return (
		<>
			<Box
				sx={{
					bgcolor: "background.default",
					p: { xs: 1.5, sm: 3 },
				}}
				flexGrow={1}
				width="100%"
				boxSizing="border-box"
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
					width="100%"
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="text.primary"
					>
						Discussions
					</Typography>
				</Box>
				<Box width="100%">
					<Divider />
				</Box>
				<Box
					sx={{ marginTop: 2 }}
					width="100%"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="text.primary"
						buttonStyle={{ mx: 0, p: 0 }}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
					<Button
						variant="outlined"
						buttonStyle={{ py: 0 }}
						fontSize={18}
						color="text.primary"
						toolTipText="Create Discussion"
						handleButtonClick={() => navigate("Create-Discussion")}
					>
						Create Discussion
					</Button>
				</Box>
			</Box>
			<Box maxWidth="100%" width="100%" boxSizing="border-box" marginTop={1}>
				<DynamicDrawer
					drawerItemTextArray={drawerItemTextArray}
					drawerItemIconArray={drawerItemIconArray}
					pageArray={[
						<DiscoverPage />,
						<DiscussionsJoinedPage />,
						<DiscussionsCreatedPage />,
					]}
					showHeader={false}
					defaultPageIndex={currentPageIndex}
					handleListItemClick={(index) =>
						navigate(`?type=${drawerItemTextArray[index]}`)
					}
					position="relative"
					pagePadding={0}
					expandable={false}
					drawerItemTooltipTextArray={drawerItemTextArray}
				/>
			</Box>
		</>
	);
};

export default Discussions;
