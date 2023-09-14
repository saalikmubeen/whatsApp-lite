import React, { useCallback, useEffect, useState } from "react";
import { FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants";
import { useAppSelector } from "../utils/store";
import { createChat, sendTextMessage } from "../utils/actions/chatActions";
import { Message } from "../utils/store/types";
import PageContainer from "../components/PageContainer";
import ChatMessage from "../components/ChatMessage";
import Bubble from "../components/Bubble";

// import BackgroundImage from "../../assets/images/droplet.jpeg";

type Props = StackScreenProps<LoggedInStackParamList, "Chat">;

const ChatScreen = (props: Props) => {
	const { selectedUserId, chatId, selectedUserIds } = props.route.params;
	const [messageText, setMessageText] = useState("");
	const [currentChatId, setCurrentChatId] = useState(chatId || null);

	const userData = useAppSelector((state) => state.auth.userData)!;

	const chatMessages = useAppSelector((state) => {
		if (!currentChatId) {
			return [];
		}

		const chatMessagesData = state.messages.messagesData[currentChatId];

		if (!chatMessagesData) {
			return [];
		}

		const messageList: Message[] = [];
		for (const key in chatMessagesData) {
			const message = chatMessagesData[key];

			messageList.push({
				messageId: key,
				...message,
			});
		}

		return messageList;
	});

	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const storedChats = useAppSelector((state) => state.chats.chatsData);

	const getChatTitle = () => {
		// chat already exists
		if (currentChatId) {
			const chatData = storedChats[currentChatId];
			if (chatData.isGroupChat) {
				return chatData.chatName;
			} else {
				const otherUserId = chatData.users.find((uid) => uid !== userData.userId)!;
				const otherUserData = storedUsers[otherUserId];
				return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
			}
		} else {
			if (selectedUserId) {
				// new individual chat
				const otherUserData = storedUsers[selectedUserId];
				return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
			} else {
				return "Group Chat";
			}
		}
	};

	const sendMessage = useCallback(async () => {
		try {
			let id = currentChatId;

			// means it's a new chat
			if (!id) {
				if (selectedUserId) {
					let newChatData = {
						users: [userData.userId, selectedUserId],
						isGroupChat: false,
					};

					// create new chat
					const newChatId = await createChat(userData.userId, newChatData);
					id = newChatId;
					setCurrentChatId(newChatId);
				}
			}

			// chat already exists
			await sendTextMessage({
				chatId: id!,
				senderId: userData.userId,
				messageText,
			});

			setMessageText("");
		} catch (err) {
			console.log(err);
		}
	}, [chatId, messageText, selectedUserId, userData.userId]);

	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: getChatTitle(),
		});
	}, []);

	return (
		<SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen} keyboardVerticalOffset={100}>
				<ImageBackground source={require("../../assets/images/droplet.jpeg")} style={styles.backgroundImage}>
					<PageContainer styles={{ backgroundColor: "transparent" }}>
						{chatId ? (
							<FlatList
								// ref={(ref) => (flatList.current = ref)}
								// onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
								// onLayout={() => flatList.current.scrollToEnd({ animated: false })}
								data={chatMessages}
								renderItem={(itemData) => {
									const message = itemData.item;

									const isOwnMessage = message.sentBy === userData.userId;
									const messageType = isOwnMessage ? "myMessage" : "theirMessage";

									// const sender = message.sentBy && storedUsers[message.sentBy];
									// const name = sender && `${sender.firstName} ${sender.lastName}`;

									return (
										<ChatMessage
											type={messageType}
											text={message.text}
											messageId={message.messageId}
											userId={userData.userId}
											chatId={chatId}
											date={message.sentAt}
											// name={!chatData.isGroupChat || isOwnMessage ? undefined : name}
											imageUrl={message.imageUrl}
										/>
									);
								}}
							/>
						) : (
							<Bubble text="This is a new chat. Say hi!" type="system" />
						)}
					</PageContainer>
				</ImageBackground>

				<View style={styles.inputContainer}>
					<TouchableOpacity style={styles.mediaButton}>
						<Feather name="plus" size={24} color={colors.blue} />
					</TouchableOpacity>

					<TextInput
						placeholder="Message..."
						style={styles.input}
						onChangeText={setMessageText}
						value={messageText}
						onSubmitEditing={sendMessage}
					/>

					{messageText.length > 0 ? (
						<TouchableOpacity style={styles.mediaButton} onPress={sendMessage}>
							<Feather name="send" size={24} color={colors.blue} />
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.mediaButton}>
							<Feather name="camera" size={24} color={colors.blue} />
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	container: {
		flex: 1,
		flexDirection: "column",
	},
	backgroundImage: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: "row",
		paddingVertical: 8,
		paddingHorizontal: 10,
		height: 50,
	},
	input: {
		flex: 1,
		alignItems: "center",
		height: 50,
		paddingHorizontal: 12,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: colors.lightGray,
		borderRadius: 50,
		marginHorizontal: 10,
		fontSize: 18,
	},
	mediaButton: {
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		width: 30,
	},
});

export default ChatScreen;
