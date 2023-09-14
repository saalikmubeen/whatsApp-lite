import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import ProfileImage from "./ProfileImage";
import { colors } from "../constants";
import UserImage from "./UserImage";

type Props = {
	title: string;
	subTitle?: string;
	image?: string;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const UserItem = (props: Props) => {
	const { title, subTitle, image, onPress } = props;

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.container}>
				<UserImage uri={image} size={40} />

				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={styles.title}>
						{title}
					</Text>

					<Text numberOfLines={1} style={styles.subTitle}>
						{subTitle}
					</Text>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: 7,
		borderBottomColor: colors.extraLightGrey,
		borderBottomWidth: 1,
		alignItems: "center",
		minHeight: 50,
	},
	textContainer: {
		marginLeft: 14,
	},
	title: {
		fontFamily: "medium",
		fontSize: 16,
		letterSpacing: 0.3,
	},
	subTitle: {
		fontFamily: "regular",
		color: colors.gray,
		letterSpacing: 0.3,
	},
});

export default UserItem;
