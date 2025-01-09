import { configureStore } from "@reduxjs/toolkit";
import signUpSliceReducer from "./features/Welcome/signUpSlice";

const store = configureStore({
	reducer: {
		signUp: signUpSliceReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
