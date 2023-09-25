import React, { useCallback, useEffect, useState, useRef } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants";
import { useAppSelector } from "../utils/store";
import { createChat, sendImage, sendTextMessage } from "../utils/actions/chatActions";
import { Message } from "../utils/store/types";
import PageContainer from "../components/PageContainer";
import ChatMessage from "../components/ChatMessage";
import Bubble from "../components/Bubble";
import ReplyingTo from "../components/ReplyingTo";
import { launchImagePicker, openCamera, uploadImageAsync } from "../utils/imagePickerHelper";
import AwesomeAlert from "../components/alerts";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

// import BackgroundImage from "../../assets/images/BG.png";

type Props = StackScreenProps<LoggedInStackParamList, "Chat">;

const ChatScreen = (props: Props) => {
	const { selectedUserId, chatId, selectedUserIds, chatName, isGroupChat } = props.route.params;
	const [messageText, setMessageText] = useState("");
	const [currentChatId, setCurrentChatId] = useState(chatId || null);
	const [replyingTo, setReplyingTo] = useState<Message | null>(null);
	const [tempImageUri, setTempImageUri] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const flatListRef = useRef<FlatList<Message>>();

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
	const chatData = (currentChatId && storedChats[currentChatId]) || props.route?.params || {};

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
				return chatName;
			}
		}
	};

	const sendMessage = useCallback(async () => {
		try {
			let id = currentChatId;
			let usersInChat: string[] = [];

			// means it's a new chat
			if (!id) {
				let newChatData = {
					isGroupChat,
				} as {
					users: string[];
					chatName?: string;
					isGroupChat: boolean;
				};

				if (selectedUserId) {
					newChatData.users = [userData.userId, selectedUserId];
					usersInChat = [userData.userId, selectedUserId];
				}

				if (selectedUserIds) {
					newChatData.users = [userData.userId, ...selectedUserIds];
					newChatData.chatName = chatName;
					usersInChat = [userData.userId, ...selectedUserIds];
				}

				// create new chat
				const newChatId = await createChat(userData.userId, newChatData);
				id = newChatId;
				setCurrentChatId(newChatId);
			} else {
				usersInChat = storedChats[id].users;
			}

			// chat already exists
			await sendTextMessage({
				chatId: id!,
				messageText,
				replyTo: replyingTo?.messageId,
				senderUserData: userData,
				usersInChat: usersInChat,
			});

			setMessageText("");
			setReplyingTo(null);
		} catch (err) {
			console.log(err);
		}
	}, [chatId, messageText, selectedUserId, userData.userId, selectedUserIds, chatName, isGroupChat]);

	const scrollToMessage = (message: Message) => {
		const index = chatMessages.findIndex((msg) => msg.messageId === message.messageId);
		flatListRef.current?.scrollToIndex({ index, animated: true });
	};

	const pickImage = useCallback(async () => {
		try {
			const tempUri = await launchImagePicker();
			if (!tempUri) return;

			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
		}
	}, [tempImageUri]);

	const takePhoto = useCallback(async () => {
		try {
			const tempUri = await openCamera();
			if (!tempUri) return;

			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
		}
	}, [tempImageUri]);

	const uploadImage = useCallback(async () => {
		setIsLoading(true);

		try {
			let id = currentChatId;
			let usersInChat: string[] = [];
			// means it's a new chat
			// If chat doesn't exist, create it (user is sending first message as an image)
			if (!id) {
				let newChatData = {
					isGroupChat,
				} as {
					users: string[];
					chatName?: string;
					isGroupChat: boolean;
				};

				if (selectedUserId) {
					newChatData.users = [userData.userId, selectedUserId];
					usersInChat = [userData.userId, selectedUserId];
				}

				if (selectedUserIds) {
					newChatData.users = [userData.userId, ...selectedUserIds];
					newChatData.chatName = chatName;
					usersInChat = [userData.userId, ...selectedUserIds];
				}

				// create new chat
				const newChatId = await createChat(userData.userId, newChatData);
				id = newChatId;
				setCurrentChatId(newChatId);
			} else {
				usersInChat = storedChats[id].users;
			}

			if (tempImageUri) {
				const uploadUrl = await uploadImageAsync(tempImageUri, true);
				setIsLoading(false);

				await sendImage({
					chatId: id!,
					senderUserData: userData,
					replyTo: replyingTo?.messageId,
					imageUrl: uploadUrl,
					usersInChat: usersInChat,
				});

				setReplyingTo(null);
				setTimeout(() => setTempImageUri(null), 500);
			}
		} catch (error) {
			console.log(error);
		}
	}, [isLoading, tempImageUri, chatId]);

	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: getChatTitle(),
			headerRight: () => {
				let chatUsers: string[] = [];
				if (currentChatId) {
					const chatData = storedChats[currentChatId];
					chatUsers = chatData.users;
				}
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						{currentChatId && (
							<Item
								title="Chat settings"
								iconName="settings-outline"
								onPress={() =>
									chatData.isGroupChat
										? props.navigation.navigate("ChatSettings", { chatId: currentChatId })
										: props.navigation.navigate("Contact", { userId: chatUsers.find((uid) => uid !== userData.userId)! })
								}
							/>
						)}
					</HeaderButtons>
				);
			},
		});
	}, [currentChatId]);

	return (
		<SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen} keyboardVerticalOffset={100}>
				<ImageBackground source={require("../../assets/images/BG.png")} style={styles.backgroundImage}>
					<PageContainer styles={{ backgroundColor: "transparent" }}>
						{chatId ? (
							<>
								{/* <Bubble text="This is a new chat. Say hi!" type="system" /> */}
								<FlatList
									ref={(ref) => {
										flatListRef.current = ref!;
									}}
									onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
									onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
									data={chatMessages}
									renderItem={(itemData) => {
										const message = itemData.item;

										const isOwnMessage = message.sentBy === userData.userId;
										// const messageType = isOwnMessage ? "myMessage" : "theirMessage";

										let messageType = "info";
										if (message.type && message.type === "info") {
											messageType = "info";
										} else if (isOwnMessage) {
											messageType = "myMessage";
										} else {
											messageType = "theirMessage";
										}

										const sender = message.sentBy && storedUsers[message.sentBy];
										const senderName = sender && `${sender.firstName} ${sender.lastName}`;
										const replyToMessage = message.replyTo
											? chatMessages.find((msg) => msg.messageId === message.replyTo)
											: undefined;
										const replyingToUser = replyToMessage && storedUsers[replyToMessage.sentBy];
										const replyToUserName =
											replyingToUser &&
											(replyingToUser.userId === userData.userId
												? "You"
												: `${replyingToUser.firstName} ${replyingToUser.lastName}`);

										return (
											<ChatMessage
												type={messageType}
												text={message.text}
												messageId={message.messageId}
												userId={userData.userId}
												chatId={chatId}
												date={message.sentAt}
												name={!chatData.isGroupChat || isOwnMessage ? undefined : senderName}
												imageUrl={message.imageUrl}
												deleted={message.type && message.type === "deleted" ? true : false}
												setReplyingTo={() => setReplyingTo(message)}
												replyTo={replyToMessage}
												replyToUser={replyToUserName}
												scrollToRepliedMessage={() => {
													if (replyToMessage) {
														scrollToMessage(replyToMessage);
													}
												}}
											/>
										);
									}}
								/>
							</>
						) : (
							<Bubble text="This is a new chat. Say hi!" type="system" />
						)}
					</PageContainer>

					{replyingTo && (
						<ReplyingTo
							text={replyingTo.text}
							user={storedUsers[replyingTo.sentBy]}
							onCancel={() => setReplyingTo(null)}
							loggedInUser={userData}
						/>
					)}
				</ImageBackground>

				<View style={styles.inputContainer}>
					<TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
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
						<TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
							<Feather name="camera" size={24} color={colors.blue} />
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>

			<AwesomeAlert
				show={!!tempImageUri}
				title="Send image?"
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={true}
				showCancelButton={true}
				showConfirmButton={true}
				cancelText="Cancel"
				confirmText="Send image"
				confirmButtonColor={colors.primary}
				cancelButtonColor={colors.red}
				titleStyle={styles.popupTitleStyle}
				onCancelPressed={() => setTempImageUri(null)}
				onConfirmPressed={uploadImage}
				onDismiss={() => setTempImageUri(null)}
				customView={
					<View>
						{isLoading && <ActivityIndicator size="small" color={colors.primary} />}
						{!isLoading && tempImageUri && <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />}
					</View>
				}
			/>
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
	popupTitleStyle: {
		fontFamily: "medium",
		letterSpacing: 0.3,
		color: colors.textColor,
	},
});

export default ChatScreen;
