import { Box,TextField } from "@mui/material";
import Button from "../../components/Button";
import EditorBar from "./EditorBar";
import {FieldErrors } from "react-hook-form";

interface Prop {
	register: (name: string, options?:object )=> object;
	submitForm: () => void;
	errors: FieldErrors;
	watch: (name: string) => string;
}
const TextPage = ({ register , submitForm, errors, watch}: Prop) => {
	return (
		<>
			<TextField
				label="Thread Title"
				variant="outlined"
				fullWidth
				required
				{...register("title", { required: true })}
				error={errors.title?.type === "required"}
				helperText={
					errors.title?.type === "required"
						? "The title field is required"
						: null
				}
				value={watch("title")}
			/>
			<br />
			<br />
			<br />
			<EditorBar />
			<br />
			<br />
			<TextField
				label="Body"
				multiline
				variant="outlined"
				minRows={4}
				fullWidth
				{...register("body")}
				value={watch("body")}
			/>
			<br />
			<br />
			<br />
			<Box textAlign="right">
				<Button
					color="primary.dark"
					variant="outlined"
					fontSize={17}
					fontWeight={600}
					handleButtonClick={submitForm}
				>
					Post
				</Button>
			</Box>
		</>
	);
};

export default TextPage;
