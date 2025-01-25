import { Box, TextField, Typography } from "@mui/material";
import {
	FieldErrors,
	Control,
	Controller,
	UseFormWatch,
	FieldValues,
} from "react-hook-form";
import SelectChip from "../../components/SelectChip";
import { useAppDispatch, useAppSelector } from "../../utilities/redux";
import { changeContent, changeTopicsSelected } from "./createThreadSlice";
import RichTextField from "../../components/RichTextField";

interface Prop {
	register: (name: string, options?: object) => object;
	createThread: () => void;
	errors: FieldErrors;
	control: Control;
	isUploading: boolean;
	watch: UseFormWatch<FieldValues>;
}

const TextPage = ({ register, errors, control, watch }: Prop) => {
	const { topicsSelected, content, discussionID } = useAppSelector((state) => ({
		topicsSelected: state.createThread.topicsSelected,
		content: state.createThread.content,
		discussionID: state.createThread.discussionID
	}));

	const dispatch = useAppDispatch();
	const handleSelectTopic = (topics: string[]) =>
		dispatch(changeTopicsSelected(topics));
	return (
		<Box>
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
						{...register("title", {
							required: "Thread title is required",
							validate: {
								validTitle: (x: string) => /^.{0,50}$/.test(x),
							},
						})}
						error={!!errors.title}
						helperText={errors.title?.message as string}
					/>
				)}
			/>
			<Typography
				fontSize={15}
				marginLeft={1}
				fontWeight={500}
				color={errors.title?.type === "validTitle" ? "red" : "inherit"}
			>
				{watch("title")?.length ? watch("title")?.length : 0}/50 Characters
			</Typography>

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
						setTopicsSelected={handleSelectTopic}
						disabled={discussionID === 0 ? false : true}
					/>
				)}
			/>

			<br />
			<br />
			<br />

			<RichTextField
				editorState={content}
				setEditorState={(editorState) => dispatch(changeContent(editorState))}
			/>
		</Box>
	);
};

export default TextPage;
