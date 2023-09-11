import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import userImage from "../../assets/images/userImage.jpeg";

import { updateSignedInUserData } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { launchImagePicker, uploadImageAsync } from "../utils/imagePickerHelper";
import { updateLoggedInUserData } from "../utils/store/authSlice";
import { colors } from "../constants";

type Props = {
	uri: string | undefined;
	userId: string;
	size: number;
};

const ProfileImage = (props: Props) => {
	const dispatch = useAppDispatch();

	const source = props.uri ? { uri: props.uri } : userImage;

	const [image, setImage] = useState(source);
	const [isLoading, setIsLoading] = useState(false);

	const userId = props.userId;

	const pickImage = async () => {
		try {
			const tempUri = await launchImagePicker();

			if (!tempUri) return;

			// Upload the image
			setIsLoading(true);
			const uploadUrl = await uploadImageAsync(tempUri);
			setIsLoading(false);

			if (!uploadUrl) {
				throw new Error("Could not upload image");
			}

			const newData = { profilePicture: uploadUrl };

			await updateSignedInUserData(userId, newData);
			dispatch(updateLoggedInUserData({ newData }));

			setImage({ uri: uploadUrl });
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	return (
		<TouchableOpacity onPress={pickImage}>
			{isLoading ? (
				<View style={{ ...styles.loadingContainer, ...{ width: props.size, height: props.size } }}>
					<ActivityIndicator size={"small"} color={colors.primary} />
				</View>
			) : (
				<Image style={{ ...styles.image, ...{ width: props.size, height: props.size } }} source={image} />
			)}

			<View style={styles.editIconContainer}>
				<FontAwesome name="pencil" size={15} color="black" />
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	image: {
		borderRadius: 50,
		borderColor: colors.gray,
		borderWidth: 1,
	},
	editIconContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: colors.lightGray,
		borderRadius: 20,
		padding: 8,
	},
	loadingContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ProfileImage;
