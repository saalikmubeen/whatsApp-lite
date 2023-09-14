import React, { useEffect, useState } from "react";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { StackNavigator } from "./LoggedInScreens";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { getFirebaseApp } from "../utils/firebase";
import { ChatData, UserData } from "../utils/store/types";
import { setStoredUsers } from "../utils/store/usersSlice";
import { setChatsData } from "../utils/store/chatsSlice";
import { setChatMessages } from "../utils/store/chatMessagesSlice";
import { ActivityIndicator, View } from "react-native";
import { colors, commonStyles } from "../constants";

const LoggedInNavigator = () => {
	const [isLoading, setIsLoading] = useState(true);
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	console.log(storedUsers);

	const dispatch = useAppDispatch();

	useEffect(() => {
		console.log("Subscribing to firebase listeners");

		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));

		// Get all the chats for the currently logged in user
		const userChatsRef = child(dbRef, `userChats/${userData.userId}`);
		const refs = [userChatsRef];

		onValue(userChatsRef, (querySnapshot) => {
			const chatIdsData = querySnapshot.val() || {};
			const chatIds: string[] = Object.values(chatIdsData); // array of chat ids: [chatId1, chatId2, ...]

			// fetch the data for each chat
			const chatsData: any = {};
			let chatsFoundCount = 0;

			if (chatIds.length === 0) {
				setIsLoading(false);
			}

			for (let i = 0; i < chatIds.length; i++) {
				const chatId = chatIds[i];
				const chatRef = child(dbRef, `chats/${chatId}`);
				refs.push(chatRef);

				onValue(chatRef, (chatSnapshot) => {
					chatsFoundCount++;

					const data: ChatData = chatSnapshot.val();

					if (data) {
						data.users.forEach((userId) => {
							if (storedUsers[userId]) return; // user data already exists in redux store

							const userRef = child(dbRef, `users/${userId}`);

							get(userRef).then((userSnapshot) => {
								const userSnapshotData = userSnapshot.val() as UserData;
								dispatch(setStoredUsers({ newUsers: { [userSnapshotData.userId]: userSnapshotData } }));
							});

							refs.push(userRef);
						});

						data.key = chatSnapshot.key!;
						data.chatId = chatSnapshot.key!;
						chatsData[data.key] = data;
					}

					if (chatsFoundCount >= chatIds.length) {
						dispatch(setChatsData({ chatsData }));
						setIsLoading(false);
					}
				});

				// get the messages for each chat
				const messagesRef = child(dbRef, `messages/${chatId}`);
				refs.push(messagesRef);

				onValue(messagesRef, (messagesSnapshot) => {
					const messagesData = messagesSnapshot.val();
					dispatch(setChatMessages({ chatId, messagesData }));
				});

				if (chatsFoundCount == 0) {
					setIsLoading(false);
				}
			}
		});

		return () => {
			console.log("Unsubscribing firebase listeners");
			refs.forEach((ref) => off(ref));
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<View style={commonStyles.center}>
					<ActivityIndicator size={"large"} color={colors.primary} />
				</View>
			) : (
				<StackNavigator />
			)}
		</>
	);
};

export default LoggedInNavigator;
