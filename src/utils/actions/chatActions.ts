import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { getFirebaseApp } from "../firebase";
import { Message } from "../store/types";

type ChatData = {
	users: string[];
	isGroupChat: boolean;
	chatName?: string;
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

type SendMessageParams = {
	chatId: string;
	senderId: string;
	messageText: string;
	imageUrl?: string;
	replyTo?: string; // other message Id
};

const sendMessage = async (data: SendMessageParams) => {
	const { chatId, senderId, messageText, imageUrl, replyTo } = data;

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

	await push(messagesRef, messageData);

	const chatRef = child(dbRef, `chats/${chatId}`);
	await update(chatRef, {
		updatedBy: senderId,
		updatedAt: new Date().toISOString(),
		latestMessageText: messageText,
	});
};

export const sendTextMessage = async (data: Omit<SendMessageParams, "imageUrl">) => {
	await sendMessage(data);
};


export const sendImage = async (data: Omit<SendMessageParams, "messageText">) => {
	await sendMessage({
		...data,
		messageText: "Image",
	});
}