import { Seen, Status } from "../utils/store/types";

export type LoggedInStackParamList = {
    Home: undefined;
    ChatSettings: { chatId: string };
    Chat: {
        selectedUserId?: string;
        chatId?: string;
        selectedUserIds?: string[];
        isGroupChat?: boolean;
        chatName?: string;
    };
    NewChat: {
        isGroupChat: boolean;
        chatId?: string;
        existingUsers?: string[];
    };
    Contact: { userId: string; chatId?: string };
    Participants: { participants: string[]; chatId: string };
    UserStatuses: { userId: string; username: string; statuses: Status[] };
    Views: { statusId: string };
    MessageInfo: {
        totalSeens: Seen[];
        messageDetails: {
            messageText: string;
            messageDate: string;
            isGroupChat: boolean;
            imageUrl?: string;
            isSeen: boolean;
            edited: boolean;
        };
    };
};

export type LoggedInTabParamList = {
    ChatList: { selectedUserId?: string };
    Settings: { userId: string };
    Status: {};
};
