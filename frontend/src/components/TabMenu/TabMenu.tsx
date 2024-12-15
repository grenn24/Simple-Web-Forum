import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

interface TabPageProp {
	children?: React.ReactNode;
	index: number;
	currentTabIndex: number;
	padding?: number | object
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
			{currentTabIndex === index && <Box sx={{ p: typeof padding === "number" ? padding : {...padding} }}>{children}</Box>}
		</Box>
	);
}

interface TabMenuProp {
	tabLabelArray: string[];
	tabPageArray?: JSX.Element[];
	variant?: "standard" | "scrollable" | "fullWidth";
	padding?: number | object;
}

export default function TabMenu({ tabLabelArray, tabPageArray, variant, padding=0 }: TabMenuProp) {
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
						marginBottom:4
					}}
					
				>
					{tabLabelArray.map((label) => (
						<Tab label={label} key={label}/>
					))}
				</Tabs>
			</Box>
			{tabLabelArray.map((_, index) => (
				<TabPage key={index} currentTabIndex={currentTabIndex} index={index} padding={padding}>
					{tabPageArray && tabPageArray[index]}
				</TabPage>
			))}
		</Box>
	);
}
