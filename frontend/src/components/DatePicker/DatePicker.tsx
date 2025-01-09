
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as DatePickerBase } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface Prop {
	label: string;
	handleDateSelect: (value: Date) => void;
	controlled?: boolean;
	defaultValue?: Date | null | undefined;
	value?: Date;
	width?: string | number
}

export default function DatePicker({
	label,
	handleDateSelect,
	controlled = false,
	defaultValue,
	value,
	width
}: Prop) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DemoContainer components={["DatePicker"]}>
				{controlled ? (
					<DatePickerBase
						label={label}
						onChange={(date) => date && handleDateSelect(date?.toDate())}
						value={dayjs(value)}
						defaultValue={dayjs(defaultValue)}
						sx={{ width: width }}
					/>
				) : (
					<DatePickerBase
						label={label}
						onChange={(date) => date && handleDateSelect(date?.toDate())}
						defaultValue={dayjs(defaultValue)}
						sx={{ width: width }}
					/>
				)}
			</DemoContainer>
		</LocalizationProvider>
	);
}
