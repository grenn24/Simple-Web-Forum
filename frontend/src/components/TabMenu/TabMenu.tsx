import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

interface TabPageProp {
	children?: React.ReactNode;
	index: number;
	currentTabIndex: number;
	padding?: number | object;
}

function TabPage(props: TabPageProp) {
	const { children, currentTabIndex, index, padding, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={currentTabIndex !== index}
			id={`simple-tabpanel-${index}`}
			{...other}
		>
			{currentTabIndex === index && (
				<Box sx={{ p: typeof padding === "number" ? padding : { ...padding } }}>
					{children}
				</Box>
			)}
		</Box>
	);
}

interface TabMenuProp {
	tabLabelArray: string[];
	tabPageArray?: JSX.Element[];
	variant?: "standard" | "scrollable" | "fullWidth";
	padding?: number | object;
	defaultPageIndex?: number;
	handleTabLabelClick?: (index:number)=>void
}

export default function TabMenu({
	tabLabelArray,
	tabPageArray,
	defaultPageIndex,
	padding = 0,
	variant = "fullWidth",
	handleTabLabelClick,
}: TabMenuProp) {
	const [currentTabIndex, setCurrentTabIndex] = useState(
		defaultPageIndex ? defaultPageIndex : 0
	);

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setCurrentTabIndex(newTabIndex);
		handleTabLabelClick && handleTabLabelClick(newTabIndex);
		event.preventDefault();
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Tabs
				value={currentTabIndex}
				onChange={handleTabChange}
				variant={variant}
				allowScrollButtonsMobile={true}
				scrollButtons="auto"
				sx={{
					"& .MuiTabs-indicator": {
						border: 1.5,
					},
					marginBottom: 3,
				}}
			>
				{tabLabelArray.map((label) => (
					<Tab label={label} key={label} />
				))}
			</Tabs>

			<Box width="100%">
				{tabLabelArray.map((_, index) => (
					<TabPage
						key={index}
						currentTabIndex={currentTabIndex}
						index={index}
						padding={padding}
					>
						{tabPageArray && tabPageArray[index]}
					</TabPage>
				))}
			</Box>
		</Box>
	);
}
