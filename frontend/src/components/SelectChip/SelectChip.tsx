import { Theme, useTheme } from "@mui/material/styles";
import {
	Box,
	TextField,
	Chip,
	MenuItem,
	InputLabel,
	OutlinedInput,
	FormControl,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import {
	removeElementFromArray,
	removeFromArray,
} from "../../utilities/arrayManipulation";
import checkAnagrams from "../../utilities/checkAnagrams";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
	return {
		fontWeight: personName.includes(name)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular,
		color: theme.palette.primary.dark
	};
}

interface SelectChipProp {
	predefinedTopics: string[];
	topicsSelected: string[];
	setTopicsSelected: (topics: string[]) => void;
}

export default function SelectChip({
	predefinedTopics,
	topicsSelected,
	setTopicsSelected,
}: SelectChipProp) {
	const theme = useTheme();
	const [customTopicField, setCustomTopicField] = useState("");

	const handleTopicSelect = (
		event: SelectChangeEvent<typeof topicsSelected>
	) => {
		const {
			target: { value },
		} = event;
		setTopicsSelected(typeof value === "string" ? value.split(",") : value);
	};

	const handleCustomTopicType = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCustomTopicField(event.target.value);
	};

	const handleAddCustomTopicToTopicsSelected = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			let customTopics = customTopicField.split(",");
			//check if custom topics are already inside topics selected
			customTopics.forEach((customTopic, index) => {
				if (customTopic == "" || checkAnagrams(topicsSelected, customTopic)) {
					customTopics = removeFromArray(customTopics, index);
				}
			});
			setTopicsSelected([...topicsSelected, ...customTopics]);
			setCustomTopicField("");
		}
	};

	return (
		<>
			<FormControl fullWidth style={{ userSelect: "none" }}>
				<InputLabel id="demo-multiple-chip-label">Topics</InputLabel>
				<Select

					labelId="demo-multiple-chip-label"
					multiple
					value={topicsSelected} //multiple values
					onChange={handleTopicSelect}
					input={<OutlinedInput id="select-multiple-chip" label="Topics" />}
					renderValue={
						topicsSelected
							? (selected) => (
									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
										{selected.map((value) => (
											<Chip
												key={value}
												label={value}
												onDelete={() => {
													setTopicsSelected(
														removeElementFromArray(topicsSelected, value)
													);
												}}
											/>
										))}
									</Box>
							  )
							: () => null
					}
					MenuProps={MenuProps}
					onKeyDownCapture={(event) =>
						event.key !== "Enter" && event.stopPropagation()
					}
				>
					{predefinedTopics.map((topic) => (
						<MenuItem
							key={topic}
							value={topic}
							style={getStyles(topic, topicsSelected, theme)}
						>
							{topic}
						</MenuItem>
					))}
					<MenuItem
						disableRipple
						sx={{
							py: 0,
							"&.Mui-focusVisible": {
								backgroundColor: "transparent", // Change focus background color
							},
							"&:hover": {
								backgroundColor: "transparent",
								cursor: "text",
							},
							backgroundColor: "transparent",
						}}
					>
						<TextField
							sx={{ py: 1 }}
							label="Custom Topic"
							variant="standard"
							onClick={(event) => event.stopPropagation()}
							fullWidth
							autoComplete="off"
							onChange={handleCustomTopicType}
							value={customTopicField}
							onKeyDown={handleAddCustomTopicToTopicsSelected}
						/>
					</MenuItem>
				</Select>
			</FormControl>
		</>
	);
}
