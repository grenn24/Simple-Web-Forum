import {
	Box,
	Divider,
	InputAdornment,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import {
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import Button from "../components/Button";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SearchRounded as SearchRoundedIcon,
} from "@mui/icons-material";
import TabMenu from "../components/TabMenu";
import { tabMenuLabels } from "../features/Search/tabMenuLabels";
import { tabMenuPages } from "../features/Search/tabMenuPages";

const Search = () => {
	const [searchParams, _] = useSearchParams();
	const type = searchParams.get("type");
	const query = searchParams.get("query");

	let currentTabIndex = 0;
	tabMenuLabels.forEach((label, index) => {
		if (label === type) {
			currentTabIndex = index;
		}
	});

	const navigate = useNavigate();
	const theme = useTheme();
	return (
		<Box
			sx={{
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			flexGrow={1}
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
				<Box display="flex" justifyContent="space-between">
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="primary.dark"
					>
						Search
					</Typography>
					<TextField
						sx={{ width: "40%" }}
						size="small"
						placeholder="Search for ... anything"
						defaultValue={query}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								const input = e.target as HTMLInputElement;
								navigate("?query=" + input.value + "&type=" + type);
							}
						}}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<SearchRoundedIcon sx={{ color: "primary.dark" }} />
									</InputAdornment>
								),
							},
						}}
					/>
					<Typography whiteSpace="preserve"> </Typography>
				</Box>
			</Box>
			<Box width="100%">
				<Divider />
			</Box>
			<Box
				marginTop={2}
				display="flex"
				justifyContent="space-between"
				width="100%"
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
					width: { xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" },
					marginBottom: 3,
				}}
			>
				<TabMenu
					tabLabelArray={tabMenuLabels}
					tabPageArray={tabMenuPages}
					defaultPageIndex={currentTabIndex}
					handleTabLabelClick={(newTabIndex) =>
						navigate("?query=" + query + "&type=" + tabMenuLabels[newTabIndex])
					}
					variant={
						useMediaQuery(theme.breakpoints.up("sm"))
							? "fullWidth"
							: "scrollable"
					}
				></TabMenu>
			</Box>
		</Box>
	);
};

export default Search;
