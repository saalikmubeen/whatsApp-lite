import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { LoggedInStackParamList } from "../navigation/types";
import Bubble from "../components/Bubble";
import { getDayAndDate, formatAmPm, getTimeAgoOrTime } from "../utils/helperFns";
import { useAppSelector } from "../utils/store";
import { colors } from "../constants";
import { FlatList } from "react-native-gesture-handler";
import UserItem from "../components/UserItem";
import { Ionicons } from "@expo/vector-icons";
import MessageInfo from "../components/MessageInfo";

type Props = StackScreenProps<LoggedInStackParamList, "MessageInfo">;

const MessageInfoScreen = (props: Props) => {
	const { totalSeens, messageDetails } = props.route.params;
	const { messageText, messageDate, imageUrl, isGroupChat, isSeen, edited } = messageDetails;

	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const seens = totalSeens.map((s) => {
		const seenUser = storedUsers[s.seenBy];
		return {
			seenAt: s.seenAt,
			seenByUser: seenUser,
		};
	});

	return (
		<SafeAreaView>
			<ImageBackground source={require("../../assets/images/BG.png")}>
				<View>
					<View style={styles.heading}>
						<Bubble text={getDayAndDate(messageDate)} type="system" />
					</View>

					<View style={styles.message}>
						<MessageInfo text={messageText} dateString={formatAmPm(messageDate)} isSeen={isSeen} edited={edited} imageUrl={imageUrl} />
					</View>
				</View>
			</ImageBackground>

			<View style={{ paddingHorizontal: 20 }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 30, marginBottom: 10 }}>
					<Ionicons name="md-checkmark-done-sharp" size={24} color={colors.blue} />
					<Text style={styles.title}>SEEN BY</Text>
				</View>
				<FlatList
					data={seens}
					renderItem={(itemData) => {
						const seenItem = itemData.item;
						const seenByUser = seenItem.seenByUser;
						const seenAt = seenItem.seenAt;

						let title = `${seenByUser.firstName} ${seenByUser.lastName}`;
						const subTitle = `Seen at: ${getTimeAgoOrTime(seenAt)}`;
						let image = seenByUser.profilePicture;

						return (
							<UserItem
								title={title}
								subTitle={subTitle}
								image={image}
								onPress={() => {
								    props.navigation.navigate("Contact", { userId: seenByUser.userId  })
								}
								}
								type="user"
							/>
						);
					}}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	heading: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	message: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 10,
		marginRight: 10,
	},
	title: {
		color: colors.textColor,
		fontFamily: "bold",
		letterSpacing: 0.3,
	},
});

export default MessageInfoScreen;
