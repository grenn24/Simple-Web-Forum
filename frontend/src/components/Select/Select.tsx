import {
	FormControl,
	InputLabel,
	MenuItem,
	Select as SelectBase,
	SelectChangeEvent,
	SxProps,
	Theme,
} from "@mui/material";

interface Prop {
	controlled?: boolean;
	selectItemsArray: string[] | number[] | JSX.Element[];
	label?: string;
	defaultItemIndex?: number;
	currentItemIndex?: number;
	handleSelect: (index: number) => void;
	disabled?: boolean;
	style?: SxProps<Theme>;
	size?: "small" | "medium";
	fontSize?: string | number;
	showEmptyItem?: boolean;
	fullWidth?: boolean
}
const Select = ({
	selectItemsArray,
	handleSelect,
	defaultItemIndex,
	currentItemIndex,
	label,
	disabled,
	style,
	size,
	fontSize,
	showEmptyItem = true,
	fullWidth = false
}: Prop) => {
	return (
		<FormControl fullWidth={fullWidth}>
			<InputLabel>{label}</InputLabel>
			<SelectBase
				value={String(currentItemIndex)}
				label={label}
				onChange={(event: SelectChangeEvent) => {
					handleSelect(Number(event.target.value));
	
				}}
				defaultValue={String(defaultItemIndex)}
				disabled={disabled}
				sx={{ ...style, fontSize }}
				size={size}
			>
				{showEmptyItem && <MenuItem value={String(-1)}>&nbsp;</MenuItem>}
				{selectItemsArray.map((item, index) => (
					<MenuItem key={index} value={String(index)}>
						{item}
					</MenuItem>
				))}
			</SelectBase>
		</FormControl>
	);
};

export default Select;
