import {
	FormControl,
	InputLabel,
	MenuItem,
	Select as SelectBase,
	SelectChangeEvent,
} from "@mui/material";

interface Prop {
	value?: string; // for controlled fields
	controlled?: boolean;
	values: string[];
	label: string;
	defaultValue?: string;
	handleSelect: (selectedValue: string) => void;
	disabled?:boolean
}
const Select = ({
	value,
	values,
	defaultValue,
	controlled = false,
	label,
	handleSelect,
	disabled
}: Prop) => {
	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			{controlled ? (
				<SelectBase
					value={value}
					label={label}
					onChange={(event: SelectChangeEvent) => {
						handleSelect(event.target.value);
					}}
					defaultValue={defaultValue}
					disabled={disabled}
				>
					<MenuItem value="">&nbsp;</MenuItem>
					{values.map((selection, index) => (
						<MenuItem key={index} value={selection}>
							{selection}
						</MenuItem>
					))}
				</SelectBase>
			) : (
				<SelectBase
					label={label}
					onChange={(event: SelectChangeEvent) => {
						handleSelect(event.target.value);
					}}
					defaultValue={defaultValue}
					disabled={disabled}
				>
					<MenuItem value="">&nbsp;</MenuItem>
					{values.map((selection, index) => (
						<MenuItem key={index} value={selection}>
							{selection}
						</MenuItem>
					))}
				</SelectBase>
			)}
		</FormControl>
	);
};

export default Select;
