export type LoggedInStackParamList = {
	Home: undefined;
	ChatSettings: { userId: string };
	Chat: { userId: string };
	NewChat: undefined;
};

export type LoggedInTabParamList = {
	ChatList: undefined;
	Settings: { userId: string };
};
