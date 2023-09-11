import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LoggedInStackParamList } from "../navigation/types";

type Props = StackScreenProps<LoggedInStackParamList>;

const ChatSettingsScreen = (props: Props) => {
	console.log(props.route.params?.userId);
	return (
		<View style={styles.container}>
			<Text
				style={{
					fontFamily: "black",
				}}
			>
				Chat Settings Screen 👋
			</Text>
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

export default ChatSettingsScreen;
