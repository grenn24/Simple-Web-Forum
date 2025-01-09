import { createSlice } from "@reduxjs/toolkit";



const initialState = {
	currentSignUpStage: 0,
	name: "",
	username: "",
	email: "",
	password: "",
	biography:"",
	faculty: undefined,
	birthday: undefined,
	nusStudent: true,
	avatarIcon: null
};
export const signUpSlice = createSlice({
	// Name of slice
	name: "signUp",
	//Declare and initialise slice state variables
	initialState: initialState,
	// Declare reducer functions corresponding to an action type in signup slice
	// Immer provides safe mutation of state fields directly
	reducers: {
		reset: () => initialState,
		incrementStage: (state) => {
			state.currentSignUpStage++;
		},
		decrementStage: (state) => {
			state.currentSignUpStage--;
		},
		changeName: (state, action) => {
			state.name = action.payload;
		},
		changeUsername: (state, action) => {
			state.username = action.payload;
		},
		changeEmail: (state, action) => {
			state.email = action.payload;
		},
		changePassword: (state, action) => {
			state.password = action.payload;
		},
		changeFaculty: (state, action) => {
			state.faculty = action.payload;
		},
		changeBirthday: (state, action) => {
			state.birthday = action.payload;
		},
		changeBiography: (state, action) => {
			state.biography = action.payload;
		},
		changeNusStudent: (state, action) => {
			state.nusStudent = action.payload;
		},
		changeAvatarIcon: (state, action) => {
			state.avatarIcon = action.payload;
		},
	},
});

// Action creators are generated for each reducer function using create slice
export const {
	reset,
	incrementStage,
	decrementStage,
	changeName,
	changeUsername,
	changeEmail,
	changePassword,
	changeFaculty,
	changeBirthday,
	changeBiography,
	changeNusStudent,
	changeAvatarIcon
} = signUpSlice.actions;

const signUpSliceReducer = signUpSlice.reducer;

export default signUpSliceReducer;
