import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Status } from "./types";

type StatusSliceState = {
	myStatuses: Status[];
	contactsStatuses: {
		[userId: string]: Status[];
	};
};

const initialState: StatusSliceState = {
	myStatuses: [],
	contactsStatuses: {},
};

const statusSlice = createSlice({
	name: "status",
	initialState: initialState,
	reducers: {
		setMyStatuses: (state, action: PayloadAction<{ statuses: Status[] }>) => {
			const { statuses } = action.payload;

			state.myStatuses = statuses;
		},
		setContactStatuses: (state, action: PayloadAction<{ userId: string; statuses: Status[] }>) => {
			const { userId, statuses } = action.payload;

			state.contactsStatuses[userId] = statuses;
		},
	},
});

export const { setMyStatuses, setContactStatuses } = statusSlice.actions;
export default statusSlice.reducer;
