import { createSlice } from "@reduxjs/toolkit";

export interface UploadDTO {
	title: "";
	uploadStatus: "";
	progress: 0;
}

const initialState = {
	// key is the upload id
	uploads: new Map() as Map<string, UploadDTO>,
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
		addUpload: (state, action) => {
			const uploads = new Map(state.uploads);
			uploads.set(action.payload.uploadID, action.payload.upload);
			state.uploads = uploads;
		},
		deleteUpload: (state, action) => {
			const newUploads = new Map(state.uploads);
			// delete upload using upload id
			newUploads.delete(action.payload);
			state.uploads = newUploads;
		},
		editUpload: (state, action) => {
			const uploads = new Map(state.uploads);
			uploads.set(action.payload.uploadID, action.payload.upload);
			state.uploads = uploads;
		},
	},
});

// Action creators are generated for each reducer function using create slice
export const { reset, addUpload, deleteUpload, editUpload } =
	createThreadSlice.actions;

const createThreadSliceReducer = createThreadSlice.reducer;

export default createThreadSliceReducer;
