import React, { useRef, useState, useEffect } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import { colors, commonStyles } from "../constants";
import { FontAwesome } from "@expo/vector-icons";
import { searchUsers } from "../utils/actions/userActions";
import UserItem from "../components/UserItem";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { UserData, Users } from "../utils/store/types";
import { setStoredUsers } from "../utils/store/usersSlice";
import UserImage from "../components/UserImage";
import { addUsersToChat } from "../utils/actions/chatActions";

type Props = StackScreenProps<LoggedInStackParamList, "NewChat">;

const NewChatScreen = (props: Props) => {
	const chatId = props.route.params.chatId;
	const existingUsersInChat = props.route.params.existingUsers;
	const isNewGroupChat = !chatId;

	const [isLoading, setIsLoading] = useState(false);
	const [addingUsers, setAddingUsers] = useState(false); // for already existing group chat
	const [users, setUsers] = useState<Users>({});
	const [noResultsFound, setNoResultsFound] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUserIds, setSelectedUserIds] = useState<Array<keyof Users>>([]); // array of user ids for group chat
	const [chatName, setChatName] = useState("");

	const selectedUsersFlatList = useRef<FlatList<string>>();

	const dispatch = useAppDispatch();

	const userData = useAppSelector((state) => state.auth.userData)!; // current logged in user
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const userChats = useAppSelector((state) => {
		const chatsData = state.chats.chatsData;
		return Object.values(chatsData);
	});

	const isGroupChat = props.route.params.isGroupChat;

	const isGroupChatDisabled = selectedUserIds.length === 0 || (chatName === "" && isNewGroupChat);

	const handleUserPressed = (otherUserId: string) => {
		if (isGroupChat) {
			setSelectedUserIds((prevState) => {
				if (prevState.includes(otherUserId)) {
					return prevState.filter((userId) => userId !== otherUserId);
				} else {
					return [...prevState, otherUserId];
				}
			});
			dispatch(setStoredUsers({ newUsers: { [otherUserId]: users[otherUserId] } }));
		} else {
			// chat with this user already exists
			let chatData = userChats.find((chat) => !chat.isGroupChat && chat.users.includes(otherUserId));

			if (chatData) {
				props.navigation.navigate("Chat", { chatId: chatData.chatId, isGroupChat: false });
			} else {
				// it's a new chat with this user
				dispatch(setStoredUsers({ newUsers: { [otherUserId]: users[otherUserId] } }));
				props.navigation.navigate("Chat", { selectedUserId: otherUserId, isGroupChat: false });
			}
		}
	};

	const addUsersToGroupChat = async () => {
		if (!chatId) return;

		const chatData = userChats.find((chat) => chat.chatId === chatId);
		if (!chatData) return;

		if (!selectedUserIds || selectedUserIds.length === 0) {
			return;
		}

		const selectedUsersData: UserData[] = [];
		selectedUserIds.forEach((uid) => {
			if (uid === userData.userId) return;
			if (!storedUsers[uid]) {
				console.log("No user data found in the data store");
				return;
			}
			selectedUsersData.push(storedUsers[uid]);
		});

		try {
			setAddingUsers(true);
			await addUsersToChat({
				userLoggedInData: userData,
				usersToAddData: selectedUsersData,
				chatData: chatData,
			});
		} catch (error) {
			console.log(error);
			setAddingUsers(false);
		}

		props.navigation.goBack();
	};

	useEffect(() => {
		props.navigation.setOptions({
			headerLeft: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item title="Close" iconName="close" onPress={() => props.navigation.goBack()} />
					</HeaderButtons>
				);
			},
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						{isGroupChat && (
							<Item
								title={isNewGroupChat ? "Create" : addingUsers ? <ActivityIndicator /> : "Add"}
								// title={<ActivityIndicator />}
								disabled={isGroupChatDisabled}
								color={isGroupChatDisabled ? colors.lightGray : undefined}
								onPress={() => {
									if (isNewGroupChat) {
										props.navigation.navigate("Chat", {
											selectedUserIds,
											chatName,
											isGroupChat: true,
										});
									} else {
										addUsersToGroupChat();
									}
								}}
							/>
						)}
					</HeaderButtons>
				);
			},
			headerTitle: isGroupChat ? "Add participants" : "New chat",
		});
	}, [chatName, selectedUserIds, isGroupChatDisabled, isGroupChat, isNewGroupChat, addingUsers]);

	useEffect(() => {
		const delaySearch = setTimeout(async () => {
			if (!searchTerm || searchTerm === "") {
				setUsers({});
				setNoResultsFound(false);
				setIsLoading(false);
				return;
			}

			setIsLoading(true);

			const usersResult = await searchUsers(searchTerm);

			// Remove the current logged in user from the search list
			if (userData.userId) {
				delete usersResult[userData.userId];
			}

			// Remove users that are already in the chat
			if (existingUsersInChat) {
				existingUsersInChat.forEach((uid) => {
					delete usersResult[uid];
				});
			}

			setUsers(usersResult);

			if (Object.keys(usersResult).length === 0) {
				setNoResultsFound(true);
			} else {
				setNoResultsFound(false);
			}

			setIsLoading(false);
		}, 650);

		return () => clearTimeout(delaySearch);
	}, [searchTerm]);

	return (
		<PageContainer>
			{isGroupChat && isNewGroupChat && (
				<>
					<View style={styles.chatNameContainer}>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.textbox}
								placeholder="Enter a name for your group chat"
								autoCorrect={false}
								autoComplete="off"
								onChangeText={(text) => setChatName(text)}
							/>
						</View>
					</View>

					{selectedUserIds.length > 0 && (
						<View style={styles.selectedUsersContainer}>
							<FlatList
								style={styles.selectedUsersList}
								data={selectedUserIds}
								horizontal={true}
								keyExtractor={(item) => item}
								contentContainerStyle={{ alignItems: "center" }}
								ref={(ref) => (selectedUsersFlatList.current = ref!)}
								onContentSizeChange={() => selectedUsersFlatList.current?.scrollToEnd()}
								renderItem={(itemData) => {
									const userId = itemData.item;
									const userData = storedUsers[userId];
									return (
										<UserImage
											styles={styles.selectedUserStyle}
											size={40}
											uri={userData.profilePicture}
											onPress={() => handleUserPressed(userId)}
											showRemoveIcon={true}
										/>
									);
								}}
							/>
						</View>
					)}
				</>
			)}

			<View style={styles.searchContainer}>
				<FontAwesome name="search" size={15} color={colors.lightGray} />

				<TextInput placeholder="Search" style={styles.searchBox} onChangeText={(text: string) => setSearchTerm(text)} />
			</View>

			{isLoading && (
				<View style={commonStyles.center}>
					<ActivityIndicator size={"large"} color={colors.primary} />
				</View>
			)}

			{!isLoading && !noResultsFound && (
				<FlatList
					data={Object.keys(users)}
					renderItem={(itemData) => {
						const userId = itemData.item;
						const userData = users[userId];

						return (
							<UserItem
								title={`${userData.firstName} ${userData.lastName}`}
								subTitle={userData.about}
								image={userData.profilePicture}
								onPress={() => handleUserPressed(userId)}
								type={isGroupChat ? "group" : "user"}
								isChecked={selectedUserIds.includes(userId)}
							/>
						);
					}}
				/>
			)}

			{!isLoading && noResultsFound && (
				<View style={commonStyles.center}>
					<FontAwesome name="question" size={55} color={colors.lightGray} style={styles.noResultsIcon} />
					<Text style={styles.noResultsText}>No users found!</Text>
				</View>
			)}

			{!isLoading && !noResultsFound && (
				<View style={commonStyles.center}>
					<FontAwesome name="users" size={55} color={colors.lightGray} style={styles.noResultsIcon} />
					<Text style={styles.noResultsText}>Enter a name to search for a user!</Text>
				</View>
			)}
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.extraLightGrey,
		height: 50,
		marginVertical: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
	},
	searchBox: {
		marginLeft: 8,
		fontSize: 15,
		width: "100%",
		height: 50,
	},
	noResultsIcon: {
		marginBottom: 20,
	},
	noResultsText: {
		color: colors.textColor,
		fontFamily: "regular",
		letterSpacing: 0.3,
	},
	chatNameContainer: {
		paddingVertical: 10,
	},
	inputContainer: {
		width: "100%",
		paddingHorizontal: 10,
		paddingVertical: 15,
		backgroundColor: colors.almostWhite,
		flexDirection: "row",
		borderRadius: 3,
	},
	textbox: {
		color: colors.textColor,
		width: "100%",
		fontFamily: "regular",
		letterSpacing: 0.3,
	},
	selectedUsersContainer: {
		height: 50,
		justifyContent: "center",
	},
	selectedUsersList: {
		height: "100%",
		paddingTop: 10,
	},
	selectedUserStyle: {
		marginRight: 5,
		marginBottom: 10,
	},
});

export default NewChatScreen;
