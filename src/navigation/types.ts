export type LoggedInStackParamList = {
	Home: undefined;
	ChatSettings: { chatId: string };
	Chat: { selectedUserId?: string; chatId?: string; selectedUserIds?: string[]; isGroupChat?: boolean; chatName?: string };
	NewChat: { isGroupChat: boolean; chatId?: string; existingUsers?: string[] };
	Contact: { userId: string };
};

export type LoggedInTabParamList = {
	ChatList: { selectedUserId?: string };
	Settings: { userId: string };
};
