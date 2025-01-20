import { createSlice } from "@reduxjs/toolkit";
import { EditorState } from "draft-js";

export interface UploadDTO {
	title: "";
	uploadStatus: "";
	progress: 0;
}

const initialState = {
	// key is the upload id
	uploads: new Map() as Map<string, UploadDTO>,
	imagesSelected: [] as File[],
	videosSelected: [] as File[],
	topicsSelected: [] as string[],
	content: EditorState.createEmpty(),
	isCompressingImages: false,
	openImageUploadedSnackbar: false,
	openVideoUploadedSnackbar: false,
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
			const uploadInfo = {
				title: action.payload.title,
				uploadStatus: action.payload.uploadStatus,
				progress: action.payload.progress,
			};
			uploads.set(action.payload.uploadID, uploadInfo);
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
			const uploadID = action.payload.uploadID;

			const uploadInfo = {
				title: action.payload.title
					? action.payload.title
					: state.uploads.get(uploadID)?.title,
				uploadStatus: action.payload.uploadStatus
					? action.payload.uploadStatus
					: state.uploads.get(uploadID)?.uploadStatus,
				progress: action.payload.progress
					? action.payload.progress
					: state.uploads.get(uploadID)?.progress,
			};
			uploads.set(uploadID, uploadInfo);
			state.uploads = uploads;
		},
		addImage: (state, action) => {
			const newImages: File = action.payload;
			state.imagesSelected = [...state.imagesSelected, newImages];
		},
		addVideo: (state, action) => {
			const newVideos: File = action.payload;
			state.videosSelected = [...state.videosSelected, newVideos];
		},
		addTopic: (state, action) => {
			const topic: string = action.payload;
			state.topicsSelected = [...state.topicsSelected, topic];
		},
		changeContent:(state,action)=>{
			state.content = action.payload;
		},
		changeImagesSelected: (state, action) => {
			const imagesSelected: File[] = action.payload;
			state.imagesSelected = imagesSelected;
		},
		changeVideosSelected: (state, action) => {
			const videosSelected: File[] = action.payload;
			state.videosSelected = videosSelected;
		},
		changeTopicsSelected: (state, action) => {
			const topicsSelected: string[] = action.payload;
			state.topicsSelected = topicsSelected;
		},
		changeIsCompressingImages: (state, action) => {
			state.isCompressingImages = action.payload;
		},
		changeOpenImageUploadedSnackbar: (state, action) => {
			state.openImageUploadedSnackbar = action.payload;
		},
		changeOpenVideoUploadedSnackbar: (state, action) => {
			state.openVideoUploadedSnackbar = action.payload;
		},
		resetFields:(state)=>{
			state.imagesSelected = [],
			state.videosSelected = [],
			state.content = EditorState.createEmpty(),
			state.topicsSelected = []
		}
	},
});

// Action creators are generated for each reducer function using create slice
export const { reset, addUpload, deleteUpload, editUpload, addImage, addVideo, changeImagesSelected, changeVideosSelected, changeIsCompressingImages , changeContent, changeOpenImageUploadedSnackbar, changeOpenVideoUploadedSnackbar, changeTopicsSelected, resetFields} =
	createThreadSlice.actions;

const createThreadSliceReducer = createThreadSlice.reducer;

export default createThreadSliceReducer;
