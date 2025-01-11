import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	uploadID:"",
	uploadStatus: false,
	progress: 0,

};
export const createThreadSlice = createSlice({
	// Name of slice
	name: "createThread",
	//Declare and initialise slice state variables
	initialState: initialState,
	// Declare reducer functions corresponding to an action type in signup slice
	// Immer provides safe mutation of state fields directly
	reducers: {
		reset: () => initialState,
		changeUploadID: (state, action) => {
			state.uploadID = action.payload;
		},
		changeProgress: (state, action) => {
			state.progress = action.payload;
		},
		changeUploadStatus: (state, action) => {
			state.uploadStatus = action.payload;
		},
	},
});

// Action creators are generated for each reducer function using create slice
export const {
	reset,
	changeUploadID,
	changeProgress,
	changeUploadStatus
} = createThreadSlice.actions;

const createThreadSliceReducer = createThreadSlice.reducer;

export default createThreadSliceReducer;
