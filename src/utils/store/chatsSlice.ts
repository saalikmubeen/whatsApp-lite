import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ChatData } from "./types";

type ChatsSliceState = {
	chatsData: {
		[K in ChatData["chatId"]]: ChatData;
	};
};

const initialState: ChatsSliceState = {
	chatsData: {},
};

const chatsSlice = createSlice({
	name: "chats",
	initialState: initialState,
	reducers: {
		setChatsData: (state, action: PayloadAction<{ chatsData: ChatsSliceState["chatsData"] }>) => {
			state.chatsData = { ...action.payload.chatsData };
		},
	},
});
export const setChatsData = chatsSlice.actions.setChatsData;
export default chatsSlice.reducer;
