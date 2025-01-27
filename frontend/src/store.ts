/// <reference types="redux-persist/types" />
import { configureStore } from "@reduxjs/toolkit";
import signUpSliceReducer from "./features/Welcome/signUpSlice";
import createThreadSliceReducer from "./features/CreateThread/createThreadSlice";
import userInfoSliceReducer from "./layouts/MainLayout/TopHeader/userInfoSlice";
import { enableMapSet } from "immer";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/lib/persistReducer";
import createDiscussionSliceReducer from "./features/Discussions/createDiscussionSlice";

// Enable map state variables
enableMapSet();

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["userInfo"],
};

const store = configureStore({
	reducer: {
		signUp: signUpSliceReducer,
		createThread: createThreadSliceReducer,
		userInfo: persistReducer(persistConfig, userInfoSliceReducer),
		createDiscussion: createDiscussionSliceReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
