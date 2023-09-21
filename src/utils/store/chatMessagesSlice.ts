import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Message, Messages } from "./types";

type MessagesSliceState = {
	messagesData: {
		[chatId: string]: Messages;
	};
};

const initialState: MessagesSliceState = {
	messagesData: {},
};

const messagesSlice = createSlice({
	name: "messages",
	initialState: initialState,
	reducers: {
		setChatMessages: (state, action: PayloadAction<{ chatId: string; messagesData: Messages }>) => {
			// const existingMessages = { ...state.messagesData };
			const existingMessages = state.messagesData;

			const { chatId, messagesData } = action.payload;

			existingMessages[chatId] = messagesData;

			// state.messagesData = existingMessages;
		},
	},
});
export const { setChatMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
