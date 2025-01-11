import { configureStore } from "@reduxjs/toolkit";
import signUpSliceReducer from "./features/Welcome/signUpSlice";
import createThreadSliceReducer from "./features/CreateThread/createThreadSlice";

const store = configureStore({
	reducer: {
		signUp: signUpSliceReducer,
		createThread: createThreadSliceReducer
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
