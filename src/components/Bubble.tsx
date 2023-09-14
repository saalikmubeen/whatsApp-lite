import React, { useRef } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { colors } from "../constants";

type Props = {
	type: "system" | "error";
	text: string;
};

const Bubble = (props: Props) => {
	const { type, text } = props;

	const bubbleStyle: ViewStyle = { ...styles.container };
	const textStyle: TextStyle = { ...styles.text };
	const wrapperStyle: ViewStyle = { ...styles.wrapperStyle };

	switch (type) {
		case "system":
			textStyle.color = "#65644A";
			bubbleStyle.backgroundColor = colors.beige;
			bubbleStyle.alignItems = "center";
			bubbleStyle.marginTop = 10;
			break;
		case "error":
			bubbleStyle.backgroundColor = colors.red;
			textStyle.color = "white";
			bubbleStyle.marginTop = 10;
			break;
		default:
			break;
	}

	return (
		<View style={wrapperStyle}>
			<View style={bubbleStyle}>
				<Text style={textStyle}>{text}</Text>
			</View>
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
});

export default Bubble;
