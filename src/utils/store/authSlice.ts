import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "./types";

type AuthSliceState = {
	token: null | string;
	userData: null | UserData;
	didTryAutoLogin: boolean;
};

const initialState: AuthSliceState = {
	token: null,
	userData: null,
	didTryAutoLogin: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		authenticate: (state, action) => {
			const { payload } = action;
			state.token = payload.token;
			state.userData = payload.userData;
			state.didTryAutoLogin = true;
		},
		setDidTryAutoLogin: (state) => {
			state.didTryAutoLogin = true;
		},
		logout: (state) => {
			state.token = null;
			state.userData = null;
			state.didTryAutoLogin = false;
		},
		updateLoggedInUserData: (state, action) => {
			state.userData = { ...state.userData, ...action.payload.newData };
		},
	},
});

export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const authenticate = authSlice.actions.authenticate;
export const logout = authSlice.actions.logout;
export const updateLoggedInUserData = authSlice.actions.updateLoggedInUserData;
export default authSlice.reducer;
