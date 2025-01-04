import { Box, TextField } from "@mui/material";
import Button from "../../components/Button";
import EditorBar from "./EditorBar";
import { FieldErrors, Control, Controller } from "react-hook-form";
import SelectChip from "../../components/SelectChip";

interface Prop {
	register: (name: string, options?: object) => object;
	submitForm: () => void;
	errors: FieldErrors;
	control: Control;
	topicsSelected: string[];
	setTopicsSelected: (topics: string[]) => void;
	isUploading: boolean
}

const TextPage = ({ register, submitForm, errors, control, topicsSelected, setTopicsSelected, isUploading }: Prop) => {
	
	return (
		<>
			<Controller
				name="title"
				control={control}
				defaultValue=""
				render={() => (
					<TextField
						label="Thread Title"
						variant="outlined"
						fullWidth
						required
						autoComplete="off"
						{...register("title", { required: "Thread title is required" })}
						error={!!errors.title}
						helperText={errors.title?.message as string}
					/>
				)}
			/>

			<br />
			<br />
			<br />
			<Controller
				name="topics"
				control={control}
				defaultValue=""
				render={() => (
					<SelectChip
						predefinedTopics={[
							"Exams",
							"CCA",
							"Homework",
							"Orientation Camp",
							"Exchange",
						]}
						topicsSelected={topicsSelected}
						setTopicsSelected={setTopicsSelected}
					/>
				)}
			/>

			<br />
			<br />
			<br />
			<EditorBar />
			<br />
			<br />
			<Controller
				name="content"
				control={control}
				defaultValue=""
				render={() => (
					<TextField
						label="Content"
						multiline
						variant="outlined"
						minRows={4}
						required
						fullWidth
						{...register("content", { required: "Thread content is required" })}
						error={!!errors.content}
						helperText={errors.content?.message as string}
					/>
				)}
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
					loadingStatus={isUploading}
				>
					Post
				</Button>
			</Box>
		</>
	);
};

export default TextPage;
