export type UserData = {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
	firstLast: string;
	signUpDate: string;
	about?: string;
	profilePicture?: string;
};

export type Users = {
	[K in UserData["userId"]]: UserData;
};

export type ChatData = {
	users: string[];
	isGroupChat: boolean;
	chatName: ChatData["isGroupChat"] extends true ? string : undefined;
	createdBy: string;
	updatedBy: string;
	createdAt: string;
	updatedAt: string;
	latestMessageText?: string;
	chatId: string;
	key: string; // chatId
};

export type Message = {
	messageId: string;
	sentBy: string;
	text: string;
	sentAt: string;
	imageUrl?: string;
	replyTo?: string; // other message Id
	// updatedAt: string;
};

export type Messages = {
	[messageId: string]: Omit<Message, "messageId">;
};
