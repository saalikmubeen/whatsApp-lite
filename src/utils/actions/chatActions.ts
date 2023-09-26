import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { getFirebaseApp } from "../firebase";
import { Message, UserData } from "../store/types";
import { ChatData as ChatDataType } from "../store/types";
import { getUserPushTokens } from "./authActions";

type ChatData = {
	users: string[];
	isGroupChat: boolean;
	chatName?: string;
	chatImage?: string;
	// createdBy: string;
	// updatedBy: string;
	// createdAt: string;
	// updatedAt: string;
	// chatId: string;
};

// creating new chat
export const createChat = async (loggedInUserId: string, chatData: ChatData) => {
	const newChatData = {
		...chatData,
		createdBy: loggedInUserId,
		updatedBy: loggedInUserId,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const newChat = await push(child(dbRef, "chats"), newChatData); // newChat.key is the chatId

		const chatUsers = newChatData.users; // array of userIds(chat participants)
		for (let i = 0; i < chatUsers.length; i++) {
			const userId = chatUsers[i];

			// also record or store the chats(chatIds) that each user is a part of
			// will be stored in the format of:
			// userChats: {
			//     userId1: {
			//         someId1: chatId1,
			//         someId2: chatId2,
			//         ...
			//     },
			const newUserChat = await push(child(dbRef, `userChats/${userId}`), newChat.key);
		}

		return newChat.key; // chatId
	} catch (err) {
		throw new Error("Something went wrong while creating a new chat. Please try again later.");
	}
};

type UpdateChatParams = {
	chatId: string;
	userId: string;
	chatData: Partial<ChatData>;
};

export const updateChatData = async (data: UpdateChatParams) => {
	const { chatId, userId, chatData } = data;
	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const chatRef = child(dbRef, `chats/${chatId}`);

	await update(chatRef, {
		...chatData,
		updatedAt: new Date().toISOString(),
		updatedBy: userId,
	});
};

type SendMessageParams = {
	chatId: string;
	senderId: string;
	messageText: string;
	imageUrl?: string;
	replyTo?: string; // other message Id
	type?: string;
};

const sendMessage = async (data: SendMessageParams) => {
	const { chatId, senderId, messageText, imageUrl, replyTo, type } = data;

	const app = getFirebaseApp();
	const dbRef = ref(getDatabase());

	// store messages for each chatId
	// record or store messages in the format of:
	// messages: {
	//     chatId1: {
	//         someMessageId1: {
	//             sentBy: senderId,
	//             sentAt: new Date().toISOString(),
	//             text: messageText,
	//             replyTo: replyTo,
	//             imageUrl: imageUrl,
	//         },
	//     }
	// }
	const messagesRef = child(dbRef, `messages/${chatId}`);

	const messageData: Omit<Message, "messageId"> = {
		sentBy: senderId,
		sentAt: new Date().toISOString(),
		text: messageText,
	};

	if (replyTo) {
		messageData.replyTo = replyTo;
	}

	if (imageUrl) {
		messageData.imageUrl = imageUrl;
	}

	if (type) {
		messageData.type = type;
	}

	await push(messagesRef, messageData);

	const chatRef = child(dbRef, `chats/${chatId}`);
	await update(chatRef, {
		updatedBy: senderId,
		updatedAt: new Date().toISOString(),
		latestMessageText: messageText,
	});
};

type sendTextMessageParams = Omit<SendMessageParams, "imageUrl" | "senderId"> & {
	senderUserData: UserData;
	usersInChat: string[];
};

export const sendTextMessage = async (data: sendTextMessageParams) => {
	await sendMessage({
		...data,
		senderId: data.senderUserData.userId,
	});

	// send push notification to all users in chat except sender
	const otherUsers = data.usersInChat.filter((uid) => uid !== data.senderUserData.userId);
	await sendPushNotificationToUsers({
		chatUsers: otherUsers,
		title: `${data.senderUserData.firstName} ${data.senderUserData.lastName}`,
		body: data.messageText,
		chatId: data.chatId,
	});
};

type SendImageParams = Omit<SendMessageParams, "messageText" | "senderId"> & {
	senderUserData: UserData;
	usersInChat: string[];
};

export const sendImage = async (data: SendImageParams) => {
	await sendMessage({
		...data,
		messageText: "Image",
		senderId: data.senderUserData.userId,
	});

	// send push notification to all users in chat except sender
	const otherUsers = data.usersInChat.filter((uid) => uid !== data.senderUserData.userId);
	await sendPushNotificationToUsers({
		chatUsers: otherUsers,
		title: `${data.senderUserData.firstName} ${data.senderUserData.lastName}`,
		body: `${data.senderUserData.firstName} sent an image`,
		chatId: data.chatId,
	});
};

export const sendInfoMessage = async (data: Omit<SendMessageParams, "type" | "imageUrl" | "replyTo">) => {
	await sendMessage({
		...data,
		type: "info",
	});
};

export const deleteMessage = async (data: { chatId: string; messageId: string; userId: string }) => {
	const { chatId, messageId, userId } = data;
	const app = getFirebaseApp();
	const dbRef = ref(getDatabase());

	const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

	await update(messageRef, {
		updatedAt: new Date().toISOString(),
		type: "deleted",
		text: "Message deleted",
	});

	const chatRef = child(dbRef, `chats/${chatId}`);
	await update(chatRef, {
		updatedBy: userId,
		updatedAt: new Date().toISOString(),
	});
};

export const editChatMessage = async (data: { chatId: string; messageId: string; text: string; userId: string }) => {
	const { chatId, messageId, text, userId } = data;
	const app = getFirebaseApp();
	const dbRef = ref(getDatabase());

	const messageRef = child(dbRef, `messages/${chatId}/${messageId}`);

	await update(messageRef, {
		updatedAt: new Date().toISOString(),
		type: "edited",
		text,
	});

	const chatRef = child(dbRef, `chats/${chatId}`);
	await update(chatRef, {
		updatedBy: userId,
		updatedAt: new Date().toISOString(),
	});
};

export const addUserChat = async (data: { userId: string; chatId: string }) => {
	const { userId, chatId } = data;
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const chatRef = child(dbRef, `userChats/${userId}`);

		await push(chatRef, chatId);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

type addUsersToChatParams = {
	userLoggedInData: UserData;
	usersToAddData: UserData[];
	chatData: ChatDataType;
};

export const addUsersToChat = async (data: addUsersToChatParams) => {
	const { userLoggedInData, usersToAddData, chatData } = data;

	const existingUsers = Object.values(chatData.users);
	const newUsers: string[] = [];

	let userAddedName = "";

	usersToAddData.forEach(async (userToAdd) => {
		const userIdToAdd = userToAdd.userId;

		if (existingUsers.includes(userIdToAdd)) return;

		newUsers.push(userIdToAdd);

		// add chatId to list of userChats for each user
		await addUserChat({ userId: userIdToAdd, chatId: chatData.key });

		userAddedName = `${userToAdd.firstName} ${userToAdd.lastName}`;
	});

	if (newUsers.length === 0) {
		return;
	}

	// await updateChatData(chatData.key, userLoggedInData.userId, { users: existingUsers.concat(newUsers) });
	await updateChatData({
		chatId: chatData.key,
		userId: userLoggedInData.userId,
		chatData: {
			users: existingUsers.concat(newUsers),
		},
	});

	// send info message to chat
	const moreUsersMessage = newUsers.length > 1 ? `and ${newUsers.length - 1} others ` : "";
	const messageText = `${userLoggedInData.firstName} ${userLoggedInData.lastName} added ${userAddedName} ${moreUsersMessage}to the chat`;
	await sendInfoMessage({
		chatId: chatData.key,
		senderId: userLoggedInData.userId,
		messageText,
	});
};

export const getUserChats = async (userId: string) => {
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userRef = child(dbRef, `userChats/${userId}`);

		const snapshot = await get(userRef);
		return snapshot.val();
	} catch (error) {
		console.log(error);
	}
};

export const deleteUserChat = async (data: { userId: string; key: string }) => {
	const { userId, key } = data;
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const chatRef = child(dbRef, `userChats/${userId}/${key}`);

		await remove(chatRef);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

type RemoveUserFromChatParams = {
	userLoggedInData: UserData;
	userToRemoveData: UserData;
	chatData: ChatDataType;
};

export const removeUserFromChat = async (data: RemoveUserFromChatParams) => {
	const { userLoggedInData, userToRemoveData, chatData } = data;

	const userToRemoveId = userToRemoveData.userId;
	const newUsers = chatData.users.filter((uid) => uid !== userToRemoveId);

	// remove user from the user list of chat
	await updateChatData({
		chatId: chatData.key,
		userId: userLoggedInData.userId,
		chatData: {
			users: newUsers,
		},
	});

	// remove chatId from the list of chats that user is a part of
	const userChats = await getUserChats(userToRemoveId);

	for (const key in userChats) {
		const currentChatId = userChats[key];

		if (currentChatId === chatData.key) {
			await deleteUserChat({
				userId: userToRemoveId,
				key,
			});
			break;
		}
	}

	const messageText =
		userLoggedInData.userId === userToRemoveData.userId
			? `${userLoggedInData.firstName} left the chat`
			: `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;

	await sendInfoMessage({
		chatId: chatData.key,
		senderId: userLoggedInData.userId,
		messageText,
	});
};

type MarkMessageAsSeenParams = {
	chatId: string;
	messageId: string;
	seenBy: string;
};

export const markMessageAsSeen = async (data: MarkMessageAsSeenParams) => {
	try {
		const { chatId, messageId, seenBy } = data;
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase());

		const messageSeenRef = child(dbRef, `messages/${chatId}/${messageId}/seen`);

		const seenData = {
			seenBy,
			seenAt: new Date().toISOString(),
		};

		await push(messageSeenRef, seenData);
	} catch (err) {
		console.log(err);
	}
};

type SendPushNotificationToUsersParams = {
	chatUsers: string[];
	title: string;
	body: string;
	chatId: string;
};

const sendPushNotificationToUsers = (data: SendPushNotificationToUsersParams) => {
	const { chatUsers, title, body, chatId } = data;
	chatUsers.forEach(async (uid) => {
		console.log("test");
		const tokens = await getUserPushTokens(uid);

		for (const key in tokens) {
			const token = tokens[key];

			await fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: token,
					title,
					body,
					data: { chatId },
				}),
			});
		}
	});
};
