import React from "react";
import { StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { colors } from "../constants";

function formatAmPm(dateString: string) {
	const date = new Date(dateString);
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	let mins: string | number = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + mins + " " + ampm;
}

type Props = {
	text: string;
	type: "myMessage" | "theirMessage" | "reply";
	messageId: string;
	chatId: string;
	userId: string;
	date: string;
	setReply?: () => void;
	replyingTo?: string;
	name?: string;
	imageUrl?: string;
};

const ChatMessage = (props: Props) => {
	const { text, type, messageId, chatId, userId, date, setReply, replyingTo, name, imageUrl } = props;

	const messageStyle: ViewStyle = { ...styles.container };
	const textStyle: TextStyle = { ...styles.text };
	const wrapperStyle: ViewStyle = { ...styles.wrapperStyle };

	const dateString = formatAmPm(date);

	switch (type) {
		case "myMessage":
			wrapperStyle.justifyContent = "flex-end";
			messageStyle.backgroundColor = "#E7FED6";
			messageStyle.maxWidth = "90%";
			break;
		case "theirMessage":
			wrapperStyle.justifyContent = "flex-start";
			messageStyle.maxWidth = "90%";
			break;
		case "reply":
			messageStyle.backgroundColor = "#F2F2F2";
			break;
		default:
			break;
	}

	return (
		<View style={wrapperStyle}>
			<TouchableWithoutFeedback style={{ width: "100%" }}>
				<View style={messageStyle}>
					{name && <Text style={styles.name}>{name}</Text>}

					<Text style={textStyle}>{text}</Text>

					<View style={styles.timeContainer}>
						<Text style={styles.time}>{dateString}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapperStyle: {
		flexDirection: "row",
		justifyContent: "center",
	},
	container: {
		backgroundColor: "white",
		borderRadius: 6,
		padding: 5,
		marginBottom: 10,
		borderColor: "#E2DACC",
		borderWidth: 1,
	},
	text: {
		fontFamily: "regular",
		letterSpacing: 0.3,
	},
	menuItemContainer: {
		flexDirection: "row",
		padding: 5,
	},
	menuText: {
		flex: 1,
		fontFamily: "regular",
		letterSpacing: 0.3,
		fontSize: 16,
	},
	timeContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	time: {
		fontFamily: "regular",
		letterSpacing: 0.3,
		color: colors.gray,
		fontSize: 12,
	},
	name: {
		fontFamily: "medium",
		letterSpacing: 0.3,
	},
	image: {
		width: 300,
		height: 300,
		marginBottom: 5,
	},
});

export default ChatMessage;
