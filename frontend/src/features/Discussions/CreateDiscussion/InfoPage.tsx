import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../utilities/redux";
import { changeDescription, changeName } from "../createDiscussionSlice";

const InfoPage = () => {
	const { name, description } = useAppSelector((state) => ({
		name: state.createDiscussion.name,
		description: state.createDiscussion.description,
	}));
	const dispatch = useAppDispatch();
	return (
		<Box>
			<TextField
				label="Name"
				variant="outlined"
				fullWidth
				required
				autoComplete="off"
				value={name}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					event.target.value.length <= 20 && dispatch(changeName(event.target.value));
				}}
				error={name === ""}
				helperText={name === "" ? "Name is required" : ""}
			/>

			<Typography
				fontSize={15}
				marginLeft={1}
				fontWeight={500}
			>
				{name.length}/20 Characters
			</Typography>

			<br />
			<br />
			<TextField
				label="Description"
				variant="outlined"
				fullWidth
				autoComplete="off"
				multiline
				value={description}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					event.target.value.length <= 200 && dispatch(changeDescription(event.target.value));
				}}
			/>
			<Typography
				fontSize={15}
				marginLeft={1}
				fontWeight={500}
			>
				{description.length}/200 Characters
			</Typography>
		</Box>
	);
};

export default InfoPage;
