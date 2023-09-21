import React from "react";
import { GestureResponderEvent, Image, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View, ViewStyle } from "react-native";

import userImage from "../../assets/images/userImage.jpeg";
import { colors } from "../constants";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
	uri: string | undefined;
	size: number;
	showRemoveIcon?: boolean;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
	styles?: ViewStyle;
};

const UserImage = (props: Props) => {
	const source = props.uri ? { uri: props.uri } : userImage;

	return (
		<TouchableWithoutFeedback onPress={props.onPress}>
			<View style={props.styles}>
				<Image style={{ ...styles.image, ...{ width: props.size, height: props.size } }} source={source} />

				{props.showRemoveIcon && (
					<View style={styles.removeIconContainer}>
						<FontAwesome name="close" size={10} color="black" />
					</View>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	image: {
		borderRadius: 50,
		borderColor: colors.gray,
		borderWidth: 1,
	},
	removeIconContainer: {
		position: "absolute",
		bottom: -3,
		right: -3,
		backgroundColor: colors.lightGray,
		borderRadius: 20,
		padding: 3,
	},
});

export default UserImage;
