import { TextField } from "@mui/material";
import { FieldErrors } from "react-hook-form";

interface Prop {
	register: (name: string, options?: object) => object;
	watch: (name: string) => string;
	errors: FieldErrors;
}
const ImagePage = ({ register, watch, errors }: Prop) => {
	return (
		<>
			<TextField
				label="Image Title"
				variant="outlined"
				fullWidth
				{...register("imageTitle")}
				value={watch("imageTitle")}
			/>
			<br />
			<br />
			<br />
			<TextField
				label="Image URL"
				variant="outlined"
				fullWidth
				{...register("imageLink", {
					required: true,
				})}
				value={watch("imageLink")}
				disabled={watch("imageTitle") === ""}
				error={errors.imageLink?.type === "required"}
				helperText={
					errors.imageLink?.type === "required"
						? "The image URL field is required"
						: null
				}
			/>
		</>
	);
};

export default ImagePage;
