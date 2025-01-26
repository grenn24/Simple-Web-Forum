import { createSlice } from "@reduxjs/toolkit";
import { AuthorDTO } from "../../dtos/AuthorDTO";


const initialState = {
	name: "",
	description: "",
	backgroundImage: null,
	isCompressingImage: false,
	selectedAuthors:[] as AuthorDTO[]
};
export const createDiscussionSlice = createSlice({
	// Name of slice
	name: "createDiscussion",
	//Declare and initialise slice state variables
	initialState: initialState,
	// Declare reducer functions corresponding to an action type in createDiscussion slice
	// Immer provides safe mutation of state fields directly
	reducers: {
		reset: () => initialState,
		changeName: (state, action) => {
			state.name = action.payload;
		},
		changeDescription: (state, action) => {
			state.description = action.payload;
		},
		changeBackgroundImage: (state, action) => {
			state.backgroundImage = action.payload;
		},
		changeIsCompressingImage: (state, action) => {
			state.isCompressingImage = action.payload;
		},
		changeSelectedAuthors: (state, action) => {
			state.selectedAuthors = action.payload;
		},
	},
});

// Action creators are generated for each reducer function using create slice
export const { reset, changeName, changeBackgroundImage, changeDescription, changeIsCompressingImage,changeSelectedAuthors} =
	createDiscussionSlice.actions;

const createDiscussionSliceReducer = createDiscussionSlice.reducer;

export default createDiscussionSliceReducer;
