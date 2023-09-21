import React, { useRef } from "react";
import { StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import * as Clipboard from "expo-clipboard";
import { colors } from "../constants";
import { Message } from "../utils/store/types";

type MenuItemProps = {
	text: string;
	icon: string;
	iconPack?: any;
	onSelect: () => void;
};

const MenuItem = (props: MenuItemProps) => {
	const Icon = props.iconPack ?? Feather;

	return (
		<MenuOption onSelect={props.onSelect}>
			<View style={styles.menuItemContainer}>
				<Text style={styles.menuText}>{props.text}</Text>
				<Icon name={props.icon} size={18} />
			</View>
		</MenuOption>
	);
};

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
	// chatId: string;
	// userId: string;
	date: string;
	setReplyingTo: () => void;
	replyTo?: Message;
	replyToUser?: string;
	name?: string;
	imageUrl?: string;
	scrollToRepliedMessage: () => void;
};

const ChatMessage = (props: Props) => {
	const { text, type, messageId, date, setReplyingTo, replyTo, name, imageUrl, replyToUser, scrollToRepliedMessage } = props;

	const messageStyle: ViewStyle = { ...styles.container };
	const textStyle: TextStyle = { ...styles.text };
	const wrapperStyle: ViewStyle = { ...styles.wrapperStyle };

	const dateString = formatAmPm(date);

	const menuRef = useRef<any>(null);

	const copyToClipboard = async (text: string) => {
		try {
			await Clipboard.setStringAsync(text);
		} catch (error) {
			console.log(error);
		}
	};

	const showMessageMenu = () => {
		if (props.type === "reply") return;
		menuRef.current?.props.ctx.menuActions.openMenu(messageId);
	}

	

	switch (type) {
		case "myMessage":
			wrapperStyle.flexDirection = "row"
			wrapperStyle.justifyContent = "flex-end";
			messageStyle.backgroundColor = "#E7FED6";
			messageStyle.maxWidth = "90%";
			break;
		case "theirMessage":
			wrapperStyle.flexDirection = "row";
			wrapperStyle.justifyContent = "flex-start";
			messageStyle.maxWidth = "90%";
			break;
		case "reply":
			messageStyle.backgroundColor = "#F2F2F2";
			wrapperStyle.borderLeftColor =  colors.blue
		    wrapperStyle.borderLeftWidth = 4
			break;
		default:
			break;
	}

	return (
		<View style={wrapperStyle}>
			<TouchableWithoutFeedback style={{ width: "100%" }} onLongPress={showMessageMenu} onPress={scrollToRepliedMessage}>
				<View style={messageStyle}>
					{name && <Text style={styles.name}>{name}</Text>}

					{replyTo && replyToUser && (
						<ChatMessage
							type="reply"
							text={replyTo.text}
							name={replyToUser}
							date={replyTo.sentAt}
							messageId={replyTo.messageId}
							setReplyingTo={() => {}}
							scrollToRepliedMessage={scrollToRepliedMessage}
						/>
					)}

					<Text style={textStyle}>{text}</Text>

					{props.type !== "reply" && (
						<View style={styles.timeContainer}>
							<Text style={styles.time}>{dateString}</Text>
						</View>
					)}
				</View>
			</TouchableWithoutFeedback>

			{props.type !== "reply" && (
				<Menu ref={menuRef} name={messageId}>
					<MenuTrigger />
					<MenuOptions>
						<MenuItem text="Copy to clipboard" icon="copy" onSelect={() => copyToClipboard(text)} />
						<MenuItem text="Reply" icon="arrow-left-circle" onSelect={setReplyingTo} />
					</MenuOptions>
				</Menu>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapperStyle: {
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
		marginBottom: 6,
	},
	image: {
		width: 300,
		height: 300,
		marginBottom: 5,
	},
});

export default ChatMessage;
