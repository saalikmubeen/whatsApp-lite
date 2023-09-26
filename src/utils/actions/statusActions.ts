import { child, getDatabase, ref, set, get, update, push } from "firebase/database";
import { getFirebaseApp } from "../firebase";

type SetUserStausParams = {
	userId: string;
	status: string;
};

export const setUserStatus = async (data: SetUserStausParams) => {
	const { userId, status } = data;
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userStatusRef = child(dbRef, `userStatus/${userId}`);

		const userStatus = {
			imageUrl: status,
			createdAt: new Date().toISOString(),
			views: {},
		};

		await push(userStatusRef, userStatus);
	} catch (error) {
		console.log(error);
	}
};

export const getUserStatuses = async (userId: string) => {
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userStatusRef = child(dbRef, `userStatus/${userId}`);

		const snapshot = await get(userStatusRef);
		const statuses = snapshot.val();

		return statuses;
	} catch (error) {
		console.log(error);
	}
};

type DeleteUserStatusParams = {
	userId: string;
	statusId: string;
};

export const deleteUserStatus = async (data: DeleteUserStatusParams) => {
	const { statusId, userId } = data;

	try {
		const userStatuses = await getUserStatuses(userId);

		for (const key in userStatuses) {
			if (key === statusId) {
				delete userStatuses[key];
				break;
			}
		}

		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userStatusesRef = child(dbRef, `userStatus/${userId}`);

		await set(userStatusesRef, userStatuses);
	} catch (error) {
		console.log(error);
	}
};

type UpdateUserStatusViewsParams = {
	userId: string; // status owner whose status is being viewed by the loggedInUser
	statusId: string;
	viewerId: string; // loggedInUserId
};

export const updateStatusViews = async (data: UpdateUserStatusViewsParams) => {
	const { viewerId, statusId, userId } = data;

	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userStatusesRef = child(dbRef, `userStatus/${userId}/${statusId}/views`);

		const viewData = {
			viewerId,
			viewedAt: new Date().toISOString(),
		}

		await push(userStatusesRef, viewData);
	} catch (error) {
		console.log(error);
	}
};
