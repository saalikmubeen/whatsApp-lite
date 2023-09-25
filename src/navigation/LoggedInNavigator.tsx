import React, { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { StackActions, useNavigation } from "@react-navigation/native";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { StackNavigator } from "./LoggedInScreens";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { getFirebaseApp } from "../utils/firebase";
import { ChatData, Status, UserData } from "../utils/store/types";
import { setStoredUsers } from "../utils/store/usersSlice";
import { setChatsData } from "../utils/store/chatsSlice";
import { setChatMessages } from "../utils/store/chatMessagesSlice";
import { ActivityIndicator, View } from "react-native";
import { colors, commonStyles } from "../constants";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { setContactStatuses, setMyStatuses } from "../utils/store/statusSlice";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "./types";

type NavigationProps = StackScreenProps<LoggedInStackParamList, "Chat">["navigation"];

const LoggedInNavigator = () => {
	const [expoPushToken, setExpoPushToken] = useState("");
	console.log("expoPushToken", expoPushToken);
	console.log(expoPushToken);
	const [isLoading, setIsLoading] = useState(true);
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const dispatch = useAppDispatch();

	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	const navigation = useNavigation<NavigationProps>();

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) => {
			if (token) {
				setExpoPushToken(token);
			}
		});

		// What to do when the app is in the background, the user receives a notification
		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			// Handle received notification
		});

		// What do do when the app is in the background, the user presses the notification
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			const { data } = response.notification.request.content;
			const chatId = data["chatId"];

			if (chatId) {
				// Navigate the user to that chat screen
				// const pushAction = StackActions.push("Chat", { chatId });
				// navigation.dispatch(pushAction);
				// OR
				navigation.navigate("Chat", { chatId });
			} else {
				console.log("No chat id sent with notification");
			}
		});

		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(notificationListener.current);
			}
			if (responseListener.current) {
				Notifications.removeNotificationSubscription(responseListener.current);
			}
		};
	}, []);

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
						chatsFoundCount = 0;
					}

					// get the statuses of each user in the chat (only get the statuses for direct chat users ignore group chat users)
					if (!data.isGroupChat) {
						const otherUserId = data.users.find((userId) => userId !== userData.userId);

						if (otherUserId) {
							const userStatusRef = child(dbRef, `userStatus/${otherUserId}`);
							refs.push(userStatusRef);
							onValue(userStatusRef, (userStatusSnapshot) => {
								const userStatusData = userStatusSnapshot.val();
								const userStatuses = [] as Status[];
								for (const key in userStatusData) {
									const status = userStatusData[key];
									status.statusId = key;
									userStatuses.push(status);
								}
								dispatch(
									setContactStatuses({
										statuses: userStatuses,
										userId: otherUserId,
									})
								);
							});
						}
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

		// Get the statuses of currently logged in user (his own sttaues)
		const userStatusRef = child(dbRef, `userStatus/${userData.userId}`);
		refs.push(userStatusRef);
		onValue(userStatusRef, (userStatusSnapshot) => {
			const userStatusData = userStatusSnapshot.val();
			const myStatues = [] as Status[];
			for (const key in userStatusData) {
				const status = userStatusData[key];
				status.statusId = key;
				myStatues.push(status);
			}
			dispatch(setMyStatuses({ statuses: myStatues }));
			// console.log("userStatusData", userStatusData);
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
