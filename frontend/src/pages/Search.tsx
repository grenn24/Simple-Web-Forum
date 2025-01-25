import {
	Box,
	Divider,
	InputAdornment,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SearchRounded as SearchRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import TabMenu from "../components/TabMenu";
import { tabMenuLabels } from "../features/Search/tabMenuLabels";
import { tabMenuPages } from "../features/Search/tabMenuPages";
import sortOrders from "../features/Search/sortOrders";
import sortIcons from "../features/Search/sortIcons";
import Menu from "../components/Menu";
import { useState } from "react";

const Search = () => {
	const [searchParams, _] = useSearchParams();
	const type = searchParams.get("type");
	const query = searchParams.get("query");
	const [searchBarValue, setSearchBarValue] = useState(query);
	const sort = searchParams.get("sort");

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
						sx={{ width: { xs: "70%", md: "40%" } }}
						value={searchBarValue}
						size="small"
						placeholder="Search for ... anything"
						onKeyDown={(e) => {
							const input = e.target as HTMLInputElement;
							if (e.key === "Enter" && input.value !== "") {
								navigate("?query=" + input.value + "&type=" + type);
								(document.activeElement as HTMLElement)?.blur();
							}
						}}
						onChange={(e) => setSearchBarValue(e.target.value)}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<SearchRoundedIcon sx={{ color: "primary.dark" }} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment
										position="start"
										onClick={() => setSearchBarValue("")}
										sx={{
											"&:hover": { cursor: "pointer" },
											display: searchBarValue ? "inherit" : "none",
										}}
									>
										<CloseRoundedIcon sx={{ color: "primary.dark" }} />
									</InputAdornment>
								),
							},
						}}
					/>
					<Typography
						whiteSpace="preserve"
						display={{ xs: "none", md: "block" }}
					>
						{" "}
					</Typography>
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
				<Menu
					menuExpandedItemsArray={
						sortOrders[
							type ? tabMenuLabels.findIndex((element) => element === type) : 0
						]
					}
					menuExpandedIconsArray={
						sortIcons[
							type ? tabMenuLabels.findIndex((element) => element === type) : 0
						]
					}
					menuExpandedDataValuesArray={sortOrders[
						type ? tabMenuLabels.findIndex((element) => element === type) : 0
					].map((sort) => sort)}
					menuIcon={<SortRoundedIcon sx={{ fontSize: 20 }} />}
					menuStyle={{
						borderRadius: 30,
						px: 2,
						py: 0,
						fontSize: 20,
						fontFamily: "Open Sans",
						color: "primary.dark",
					}}
					handleMenuExpandedItemsClick={Array(
						sortOrders[
							type ? tabMenuLabels.findIndex((element) => element === type) : 0
						].length
					).fill((event: React.MouseEvent<HTMLElement>) =>
						navigate(
							`?query=${query}&type=${type}&sort=${event.currentTarget.dataset?.value}`
						)
					)}
					toolTipText="Sort Options"
					menuExpandedPosition={{ vertical: "top", horizontal: "right" }}
				>
					{
						sortOrders[
							type ? tabMenuLabels.findIndex((element) => element === type) : 0
						][
							sort
								? sortOrders[
										type
											? tabMenuLabels.findIndex((element) => element === type)
											: 0
								  ].findIndex((element) => element === sort)
								: 0
						]
					}
				</Menu>
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
					defaultPageIndex={
						type ? tabMenuLabels.findIndex((element) => element === type) : 0
					}
					handleTabLabelClick={(newTabIndex) =>
						navigate("?query=" + query + "&type=" + tabMenuLabels[newTabIndex])
					}
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

export default Search;
