import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";

type Props = CompositeScreenProps<BottomTabScreenProps<LoggedInTabParamList, "ChatList">, StackScreenProps<LoggedInStackParamList>>;

const ChatListScreen = (props: Props) => {
	return (
		<View style={styles.container}>
			<Text
				style={{
					fontFamily: "black",
				}}
			>
				Chat List Screen 👋
			</Text>
			<Button
				title="Chat"
				onPress={() => {
					props.navigation.removeListener;
					props.navigation.navigate("Chat", { userId: "jane" });
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ChatListScreen;
