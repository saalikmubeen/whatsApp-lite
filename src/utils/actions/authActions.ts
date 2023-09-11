import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { child, getDatabase, ref, set, get, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirebaseApp } from "../firebase";
import { authenticate, logout } from "../store/authSlice";
import { ApplicationDispatch } from "../store";

type SignUpParams = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
};

type SignInParams = {
	email: string;
	password: string;
};

type TokenManager = {
	accessToken: string;
	expirationTime: string;
	refreshToken: string;
};

let timer: NodeJS.Timeout;

export const signUp = (credentials: SignUpParams) => {
	return async (dispatch: ApplicationDispatch) => {
		const app = getFirebaseApp();
		const auth = getAuth(app);

		try {
			const { email, password, firstName, lastName } = credentials;
			const res = await createUserWithEmailAndPassword(auth, email, password);
			const user = res.user as any;

			const stsTokenManager = user.stsTokenManager as TokenManager;
			const userId = user.uid;
			const { accessToken, expirationTime } = stsTokenManager;

			const expiryDate = new Date(expirationTime);
			const timeNow = new Date();
			const millisecondsUntilExpiry = expiryDate.valueOf() - timeNow.valueOf();

			// SAVE USER TO FIREBASE DATABASE
			const userData = await createUser({ firstName, lastName, email, userId });

			saveDataToStorage({
				token: accessToken,
				userId,
				expiryDate,
			});

			timer = setTimeout(() => {
				dispatch(userLogout());
			}, millisecondsUntilExpiry);

			dispatch(authenticate({ token: accessToken, userData }));
		} catch (error: any) {
			console.log(error);
			const errorCode = error.code;

			let message = "Something went wrong.";

			if (errorCode === "auth/email-already-in-use") {
				message = "Email already in use!";
			}

			throw new Error(message);
		}
	};
};

export const signIn = (credentials: SignInParams) => {
	return async (dispatch: ApplicationDispatch) => {
		const app = getFirebaseApp();
		const auth = getAuth(app);

		try {
			const { email, password } = credentials;
			const result = await signInWithEmailAndPassword(auth, email, password);
			const { uid, stsTokenManager } = result.user as any;
			const { accessToken, expirationTime } = stsTokenManager as TokenManager;

			const expiryDate = new Date(expirationTime);
			const timeNow = new Date();
			const millisecondsUntilExpiry = expiryDate.valueOf() - timeNow.valueOf();

			const userData = await getUserData(uid);

			saveDataToStorage({
				token: accessToken,
				userId: uid,
				expiryDate,
			});

			timer = setTimeout(() => {
				dispatch(userLogout());
			}, millisecondsUntilExpiry);

			dispatch(authenticate({ token: accessToken, userData }));
		} catch (error: any) {
			const errorCode = error.code;

			let message = "Something went wrong.";

			if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
				message = "The username or password was incorrect";
			}

			throw new Error(message);
		}
	};
};

type UpdateSignedInUserDataParams = {
	firstName?: string;
	lastName?: string;
	email?: string;
	about?: string;
	firstLast?: string;
	profilePicture?: string;
};

export const updateSignedInUserData = async (userId: string, newData: UpdateSignedInUserDataParams) => {
	if (newData.firstName && newData.lastName) {
		const firstLast = `${newData.firstName} ${newData.lastName}`.toLowerCase();
		newData.firstLast = firstLast;
	}

	const dbRef = ref(getDatabase());
	const childRef = child(dbRef, `users/${userId}`);
	await update(childRef, newData);
};

type CreateUserParams = {
	firstName: string;
	lastName: string;
	email: string;
	userId: string;
};

const createUser = async (data: CreateUserParams) => {
	const { firstName, lastName, email, userId } = data;
	const firstLast = `${firstName} ${lastName}`.toLowerCase();
	const userData = {
		firstName,
		lastName,
		firstLast,
		email,
		userId,
		signUpDate: new Date().toISOString(),
	};

	const dbRef = ref(getDatabase());
	const childRef = child(dbRef, `users/${userId}`);
	await set(childRef, userData);
	return userData;
};

export const userLogout = () => {
	return async (dispatch: ApplicationDispatch) => {
		AsyncStorage.clear();
		if (timer) {
			clearTimeout(timer);
		}
		dispatch(logout());
	};
};

type SaveDataToStorageParams = {
	token: string;
	userId: string;
	expiryDate: Date;
};

const saveDataToStorage = (data: SaveDataToStorageParams) => {
	const { token, userId, expiryDate } = data;
	AsyncStorage.setItem(
		"userData",
		JSON.stringify({
			token,
			userId,
			expiryDate: expiryDate.toISOString(),
		})
	);
};

export const getUserData = async (userId: string) => {
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userRef = child(dbRef, `users/${userId}`);

		const snapshot = await get(userRef);
		return snapshot.val();
	} catch (error) {
		console.log(error);
	}
};
