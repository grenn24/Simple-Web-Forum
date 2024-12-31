import { Box, TextField } from "@mui/material";
import Button from "../../components/Button";
import EditorBar from "./EditorBar";
import { FieldErrors, Control, Controller } from "react-hook-form";
import SelectChip from "../../components/SelectChip";
import { useState } from "react";

interface Prop {
	register: (name: string, options?: object) => object;
	submitForm: () => void;
	errors: FieldErrors;
	control: Control;
	topicsSelected: string[];
	setTopicsSelected: (topics: string[]) => void;
}

const TextPage = ({ register, submitForm, errors, control, topicsSelected, setTopicsSelected }: Prop) => {
	
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
						{...register("title", { required: true })}
						error={errors.title?.type === "required"}
						helperText={
							errors.title?.type === "required"
								? "The title field is required"
								: null
						}
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
						fullWidth
						{...register("content")}
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
				>
					Post
				</Button>
			</Box>
		</>
	);
};

export default TextPage;
