import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Users } from "./types";

type UserSliceState = {
	storedUsers: Users;
};

const initialState: UserSliceState = {
	storedUsers: {},
};

const userSlice = createSlice({
	name: "users",
	initialState: initialState,
	reducers: {
		setStoredUsers: (state, action: PayloadAction<{ newUsers: Users }>) => {
			const payload = action.payload.newUsers;
			const newUsers = { ...payload };
			// const existingUsers = { ...state.storedUsers };
			const existingUsers = state.storedUsers;

			const usersArray = Object.values(newUsers);
			for (let i = 0; i < usersArray.length; i++) {
				const userData = usersArray[i];
				existingUsers[userData.userId] = userData;
			}

			// state.storedUsers = existingUsers;
		},
	},
});

export const setStoredUsers = userSlice.actions.setStoredUsers;
export default userSlice.reducer;
