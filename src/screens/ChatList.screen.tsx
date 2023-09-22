import React, { useLayoutEffect } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useAppSelector } from "../utils/store";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../constants";
import UserItem from "../components/UserItem";

type Props = CompositeScreenProps<BottomTabScreenProps<LoggedInTabParamList, "ChatList">, StackScreenProps<LoggedInStackParamList>>;

const ChatListScreen = (props: Props) => {
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const userChats = useAppSelector((state) => {
		const chatsData = state.chats.chatsData;
		return Object.values(chatsData).sort((a, b) => {
			return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
		});
	});

	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="New chat"
							iconName="create-outline"
							onPress={() => props.navigation.navigate("NewChat", { isGroupChat: false })}
						/>
					</HeaderButtons>
				);
			},
		});
	}, []);

	return (
		<PageContainer>
			<PageTitle text="Chats" />

			<View style={styles.newGroupContainer}>
				<TouchableOpacity onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true })}>
					<Text style={styles.newGroupText}>New Group</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={userChats}
				renderItem={(itemData) => {
					const chatData = itemData.item;
					const chatId = chatData.chatId;
					const isGroupChat = chatData.isGroupChat;

					let title = "";
					const subTitle = chatData.latestMessageText || "New chat";
					let image: string | undefined = "";

					if (isGroupChat) {
						title = chatData.chatName!;
						image = chatData.chatImage;
					} else {
						const otherUserId = chatData.users.find((uid) => uid !== userData.userId);
						if (otherUserId) {
							const otherUser = storedUsers[otherUserId];

							if (otherUser) {
								title = `${otherUser.firstName} ${otherUser.lastName}`;
								image = otherUser.profilePicture;
							}
						}
					}

					return (
						<UserItem
							title={title}
							subTitle={subTitle}
							image={image}
							onPress={() => props.navigation.navigate("Chat", { chatId })}
							type="user"
						/>
					);
				}}
			/>
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	newGroupContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	newGroupText: {
		color: colors.blue,
		fontSize: 17,
		marginBottom: 5,
	},
});

export default ChatListScreen;
