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
import { useRef, useState } from "react";
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
		color: theme.palette.primary.dark,
	};
}

interface SelectChipProp {
	predefinedTopics: string[];
	topicsSelected: string[];
	setTopicsSelected: (topics: string[]) => void;
	disabled?: boolean
}

export default function SelectChip({
	predefinedTopics,
	topicsSelected,
	setTopicsSelected,
	disabled=false
}: SelectChipProp) {
	const theme = useTheme();
	const [customTopicField, setCustomTopicField] = useState("");
	const selectRef = useRef<HTMLElement>();

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
		
				} else {
					setTopicsSelected([...topicsSelected, customTopic]);
					customTopics = removeFromArray(customTopics, index);
				}
			});

			setCustomTopicField(customTopics.join(","));
			selectRef.current?.blur();
		}
	};

	return (
		<>
			<FormControl fullWidth style={{ userSelect: "none" }}>
				<InputLabel id="demo-multiple-chip-label" disabled={disabled}>
					Topics
				</InputLabel>
				<Select
					ref={selectRef}
					disabled={disabled}
					labelId="demo-multiple-chip-label"
					multiple
					value={topicsSelected}
					onChange={handleTopicSelect}
					input={<OutlinedInput id="select-multiple-chip" label="Topics" />}
					renderValue={
						topicsSelected
							? (selected) => (
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 0.5,
										}}
									>
										{selected.map((value) => (
											<Chip
												key={value}
												label={value}
												onMouseDown={(event) => {
													event.stopPropagation();
												}}
												onDelete={() => {
													console.log("drsgh");
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
								backgroundColor: "transparent",
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
