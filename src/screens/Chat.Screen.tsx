import React, { useState } from "react";
import { Button, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants";

// import BackgroundImage from "../../assets/images/droplet.jpeg";

// type Props = CompositeScreenProps<BottomTabScreenProps<LoggedInTabParamList, "ChatList">, StackScreenProps<LoggedInStackParamList>>;

const ChatScreen = () => {
	const [messageText, setMessageText] = useState("");

	const sendMessage = () => {
		console.log(messageText);
		setMessageText("");
	};
	return (
		<SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen} keyboardVerticalOffset={100}>
				<ImageBackground source={require("../../assets/images/droplet.jpeg")} style={styles.backgroundImage}>
					<Text>{messageText}</Text>
				</ImageBackground>

				<View style={styles.inputContainer}>
					<TouchableOpacity style={styles.mediaButton}>
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
						<TouchableOpacity style={styles.mediaButton}>
							<Feather name="camera" size={24} color={colors.blue} />
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>
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
});

export default ChatScreen;
