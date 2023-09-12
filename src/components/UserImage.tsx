import React from "react";
import { Image, StyleSheet } from "react-native";

import userImage from "../../assets/images/userImage.jpeg";
import { colors } from "../constants";

type Props = {
	uri: string | undefined;
	size: number;
};

const UserImage = (props: Props) => {
	const source = props.uri ? { uri: props.uri } : userImage;

	return <Image style={{ ...styles.image, ...{ width: props.size, height: props.size } }} source={source} />;
};

const styles = StyleSheet.create({
	image: {
		borderRadius: 50,
		borderColor: colors.gray,
		borderWidth: 1,
	},
});

export default UserImage;
