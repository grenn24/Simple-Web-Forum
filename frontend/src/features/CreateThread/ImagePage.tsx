import { TextField } from "@mui/material";
import { FieldErrors, Controller, Control } from "react-hook-form";

interface Prop {
	register: (name: string, options?: object) => object;
	watch: (name: string) => string;
	errors: FieldErrors;
	control: Control;
}
const ImagePage = ({ register, watch, errors, control }: Prop) => {
	return (
		<>
			<Controller
				name="imageTitle"
				control={control}
				defaultValue=""
				render={() => (
					<TextField
						label="Image Title"
						variant="outlined"
						fullWidth
						{...register("imageTitle")}
					/>
				)}
			/>

			<br />
			<br />
			<br />
			<Controller
				name="imageLink"
				control={control}
				defaultValue=""
				render={() => (
					<TextField
						label="Image URL"
						variant="outlined"
						fullWidth
						{...register("imageLink", {
							required: true,
						})}
						disabled={watch("imageTitle") === ""}
						error={errors.imageLink?.type === "required"}
						helperText={
							errors.imageLink?.type === "required"
								? "The image URL field is required"
								: null
						}
					/>
				)}
			/>
		</>
	);
};

export default ImagePage;
