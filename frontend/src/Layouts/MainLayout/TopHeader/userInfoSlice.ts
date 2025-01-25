import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	avatarIconLink: "",
	name: "",
	username: "",
	authorID: 0,
};
export const userInfoSlice = createSlice({
	// Name of slice
	name: "userInfo",
	//Declare and initialise slice state variables
	initialState: initialState,
	// Declare reducer functions corresponding to an action type in signup slice
	// Immer provides safe mutation of state fields directly
	reducers: {
		reset: () => initialState,
		changeName: (state, action) => {
			state.name = action.payload;
		},
		changeUsername: (state, action) => {
			state.username = action.payload;
		},
		changeAvatarIconLink: (state, action) => {
			state.avatarIconLink = action.payload;
		},
		changeAuthorID: (state, action) => {
			state.authorID = action.payload;
		},
	},
});

// Action creators are generated for each reducer function using create slice
export const { reset, changeName, changeUsername, changeAvatarIconLink,changeAuthorID } =
	userInfoSlice.actions;

const userInfoSliceReducer = userInfoSlice.reducer;

export default userInfoSliceReducer;
