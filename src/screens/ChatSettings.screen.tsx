import React, { useReducer, useCallback, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LoggedInStackParamList } from "../navigation/types";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { ScrollView } from "react-native-gesture-handler";
import ProfileImage from "../components/ProfileImage";
import { useAppSelector } from "../utils/store";
import Input from "../components/Input";
import { colors } from "../constants";
import { reducer } from "../utils/reducers/formReducer";
import { validateInput } from "../utils/actions/formActions";
import UserItem from "../components/UserItem";
import SubmitButton from "../components/SubmitButton";
import { removeUserFromChat, updateChatData } from "../utils/actions/chatActions";

type Props = StackScreenProps<LoggedInStackParamList, "ChatSettings">;

const ChatSettingsScreen = (props: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const chatId = props.route.params.chatId;
	const chatData = useAppSelector((state) => state.chats.chatsData[chatId] || {});
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const initialState = {
		inputValues: { chatName: chatData.chatName! },
		inputValidities: { chatName: undefined },
		formIsValid: false,
	};

	const [formState, dispatchFormState] = useReducer(reducer, initialState);

	const inputChangedHandler = useCallback(
		(inputId: string, inputValue: string) => {
			const result = validateInput(inputId, inputValue);
			dispatchFormState({ inputId, validationResult: result, inputValue });
		},
		[dispatchFormState]
	);

	const hasChanges = () => {
		const currentValues = formState.inputValues;
		return currentValues.chatName != chatData.chatName;
	};

	const saveHandler = useCallback(async () => {
		const updatedValues = formState.inputValues;

		try {
			setIsLoading(true);
			await updateChatData({
				chatId,
				userId: userData.userId,
				chatData: updatedValues,
			});

			setShowSuccessMessage(true);

			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 1500);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [formState]);

	const leaveChat = useCallback(async () => {
		try {
			setIsLoading(true);

			await removeUserFromChat({
				userLoggedInData: userData,
				userToRemoveData: userData,
				chatData,
			});

			props.navigation.popToTop();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [props.navigation, isLoading]);

	if (!chatData.users) {
		return null;
	}

	return (
		<PageContainer>
			<PageTitle text="Chat Settings" />

			<ScrollView contentContainerStyle={styles.scrollView}>
				<ProfileImage size={80} chatId={chatId} userId={userData.userId} uri={chatData.chatImage} />

				<Input
					id="chatName"
					label="Chat name"
					autoCapitalize="none"
					initialValue={chatData.chatName}
					onInputChanged={inputChangedHandler}
					errorText={formState.inputValidities["chatName"]}
				/>

				<View style={styles.sectionContainer}>
					<Text style={styles.heading}>{chatData.users.length} Participants</Text>

					<UserItem
						title="Add users"
						icon="plus"
						type="button"
						onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true, chatId, existingUsers: chatData.users })}
					/>

					{chatData.users.slice(0, 2).map((uid) => {
						const currentUser = storedUsers[uid];
						return (
							<UserItem
								key={uid}
								image={currentUser.profilePicture}
								title={uid === userData.userId ? "You" : `${currentUser.firstName} ${currentUser.lastName}`}
								subTitle={currentUser.about}
								type={uid === userData.userId ? "user" : "link"}
								onPress={() => uid !== userData.userId && props.navigation.navigate("Contact", { userId: uid, chatId: chatId })}
							/>
						);
					})}

					{chatData.users.length > 2 && (
						<UserItem
							type={"link"}
							title="View all"
							hideImage={true}
							onPress={() => props.navigation.navigate("Participants", { participants: chatData.users, chatId })}
						/>
					)}
				</View>

				<View style={{ marginTop: 20 }}>
					{showSuccessMessage && <Text>Saved!</Text>}

					{isLoading ? (
						<ActivityIndicator size={"small"} color={colors.primary} />
					) : (
						hasChanges() && (
							<SubmitButton title="Save changes" color={colors.primary} onPress={saveHandler} disabled={!formState.formIsValid} />
						)
					)}
				</View>
			</ScrollView>

			{!isLoading ? (
				<SubmitButton title="Leave chat" color={colors.red} onPress={() => leaveChat()} style={{ marginBottom: 20 }} />
			) : (
				<ActivityIndicator size={"small"} color={colors.primary} style={{ marginBottom: 20 }} />
			)}
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollView: {
		justifyContent: "center",
		alignItems: "center",
	},
	sectionContainer: {
		width: "100%",
		marginTop: 10,
	},
	heading: {
		marginVertical: 8,
		color: colors.textColor,
		fontFamily: "bold",
		letterSpacing: 0.3,
	},
});

export default ChatSettingsScreen;
