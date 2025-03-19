/// <reference types="redux-persist/types" />
import { combineReducers, configureStore } from "@reduxjs/toolkit";
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


const rootReducer = combineReducers({
	signUp: signUpSliceReducer,
	createThread: createThreadSliceReducer,
	userInfo: userInfoSliceReducer,
	createDiscussion: createDiscussionSliceReducer,
});


const store = configureStore({
	reducer: persistReducer(persistConfig, rootReducer)
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
