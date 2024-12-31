import * as React from "react";
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
import { UseFormRegister } from "react-hook-form";

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

	return (
		<>
			<FormControl fullWidth>
				<InputLabel id="demo-multiple-chip-label">Topics</InputLabel>
				<Select
					labelId="demo-multiple-chip-label"
					id="demo-multiple-chip"
					multiple
					value={topicsSelected} //multiple values
					onChange={handleTopicSelect}
					input={<OutlinedInput id="select-multiple-chip" label="Topics" />}
					renderValue={
						topicsSelected
							? (selected) => (
									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
										{selected.map((value) => (
											<Chip key={value} label={value} />
										))}
									</Box>
							  )
							: () => null
					}
					MenuProps={MenuProps}
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
							onChange={(event) => setCustomTopicField(event.target.value)}
							value={customTopicField}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									setTopicsSelected(
										topicsSelected.concat(customTopicField.split(","))
									);
									setCustomTopicField("");
									console.log(customTopicField);
								}
							}}
						/>
					</MenuItem>
				</Select>
			</FormControl>
		</>
	);
}
