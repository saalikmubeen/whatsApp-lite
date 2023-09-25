import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authSlice from "./authSlice";
import usersSlice from "./usersSlice";
import chatsSlice from "./chatsSlice";
import chatMessagesSlice from "./chatMessagesSlice";
import statusSlice from "./statusSlice";

export const store = configureStore({
	reducer: {
		auth: authSlice,
		storedUsers: usersSlice,
		chats: chatsSlice,
		messages: chatMessagesSlice,
		statuses: statusSlice,
	},
});

export type ApplicationState = ReturnType<typeof store.getState>;
export type ApplicationDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector;
export const useAppDispatch: () => ApplicationDispatch = useDispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
