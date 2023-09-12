import React, { useLayoutEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";

type Props = CompositeScreenProps<BottomTabScreenProps<LoggedInTabParamList, "ChatList">, StackScreenProps<LoggedInStackParamList>>;

const ChatListScreen = (props: Props) => {
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item title="New chat" iconName="create-outline" onPress={() => props.navigation.navigate("NewChat")} />
					</HeaderButtons>
				);
			},
		});
	}, []);

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
		// backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ChatListScreen;
