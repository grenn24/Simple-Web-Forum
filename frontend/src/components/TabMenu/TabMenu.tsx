import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

interface TabPageProp {
	children?: React.ReactNode;
	index: number;
	currentTabIndex: number;
}

function TabPage(props: TabPageProp) {
	const { children, currentTabIndex, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={currentTabIndex !== index}
			id={`simple-tabpanel-${index}`}
			{...other}
		>
			{currentTabIndex === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</Box>
	);
}

interface TabMenuProp {
	tabLabelArray: string[];
	tabPageArray?: JSX.Element[];
	variant?: "standard" | "scrollable" | "fullWidth";
}

export default function TabMenu({ tabLabelArray, tabPageArray, variant }: TabMenuProp) {
	const [currentTabIndex, setCurrentTabIndex] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTabIndex(newValue);
		event.preventDefault();
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box>
				<Tabs
					value={currentTabIndex}
					onChange={handleTabChange}
					variant={variant}
					sx={{
						"& .MuiTabs-indicator": {
							border: 1.5,
						},
					}}
				>
					{tabLabelArray.map((label) => (
						<Tab label={label} key={label}/>
					))}
				</Tabs>
			</Box>
			{tabLabelArray.map((_, index) => (
				<TabPage key={index} currentTabIndex={currentTabIndex} index={index}>
					{tabPageArray && tabPageArray[index]}
				</TabPage>
			))}
		</Box>
	);
}
