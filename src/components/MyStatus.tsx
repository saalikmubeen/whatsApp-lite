import React, { useState } from "react";
import { ActivityIndicator, GestureResponderEvent, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../constants";
import UserImage from "./UserImage";
import { AntDesign, Ionicons, Entypo, FontAwesome } from "@expo/vector-icons";
import { launchImagePicker, uploadImageAsync } from "../utils/imagePickerHelper";
import AwesomeAlert from "./alerts";
import { setUserStatus } from "../utils/actions/statusActions";
import { useAppSelector } from "../utils/store";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";

type NavigationProps = StackScreenProps<LoggedInStackParamList, "UserStatuses">["navigation"];

const MyStatus = () => {
	const navigation = useNavigation<NavigationProps>();
	const [isLoading, setIsLoading] = useState(false);
	const [tempImageUri, setTempImageUri] = useState<string | null>(null);

	const userData = useAppSelector((state) => state.auth.userData)!;
	const myStatuses = useAppSelector((state) => state.statuses.myStatuses);

	const pickImage = async () => {
		try {
			const tempUri = await launchImagePicker();

			if (!tempUri) return;

			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const uploadImage = async () => {
		if (!tempImageUri) return;
		// Upload the image
		setIsLoading(true);
		const uploadUrl = await uploadImageAsync(tempImageUri, false, true);

		if (!uploadUrl) {
			throw new Error("Could not upload image");
		}

		await setUserStatus({
			status: uploadUrl,
			userId: userData.userId,
		});

		setIsLoading(false);
		setTimeout(() => setTempImageUri(null), 500);
	};

	const recentStatus = myStatuses[0];

	const onPress = () => {
		myStatuses.length === 0
			? pickImage()
			: navigation.navigate("UserStatuses", { statuses: myStatuses, userId: userData.userId, username: "You" });
	};

	return (
		<View>
			<View style={styles.container}>
				<View>
					<UserImage uri={userData.profilePicture} size={40} onPress={onPress} />
					<View style={styles.plusIconContainer}>
						{myStatuses.length === 0 && <Entypo name="circle-with-plus" size={24} color={colors.blue} />}
					</View>
				</View>

				<TouchableWithoutFeedback onPress={onPress}>
					<View style={styles.textContainer}>
						<Text numberOfLines={1} style={styles.title}>
							My Status
						</Text>

						<Text numberOfLines={1} style={styles.subTitle}>
							{recentStatus
								? `You have uploaded ${myStatuses.length} ${myStatuses.length === 1 ? "story" : "stories"}`
								: "Add to my status"}
						</Text>
					</View>
				</TouchableWithoutFeedback>

				<Entypo name="camera" size={24} color={colors.blue} style={styles.iconContainer} onPress={pickImage} />

				<AwesomeAlert
					show={!!tempImageUri}
					title="Set as status"
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={true}
					showCancelButton={true}
					showConfirmButton={true}
					cancelText="Cancel"
					confirmText="Set status"
					confirmButtonColor={colors.primary}
					cancelButtonColor={colors.red}
					titleStyle={styles.popupTitleStyle}
					onCancelPressed={() => setTempImageUri(null)}
					onConfirmPressed={uploadImage}
					onDismiss={() => setTempImageUri(null)}
					customView={
						<View>
							{isLoading && <ActivityIndicator size="small" color={colors.primary} />}
							{!isLoading && tempImageUri && <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />}
						</View>
					}
				/>
			</View>
		</View>
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
		flex: 1,
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
	iconContainer: {
		borderWidth: 1,
		borderRadius: 20,
		borderColor: colors.lightGray,
		backgroundColor: colors.lightGray,
		padding: 8,
		overflow: "hidden",
	},
	checkedStyle: {
		backgroundColor: colors.primary,
		borderColor: "transparent",
	},
	plusIconContainer: {
		position: "absolute",
		bottom: -13,
		right: -13,
		// backgroundColor: colors.lightGray,
		borderRadius: 20,
		padding: 8,
	},
	popupTitleStyle: {
		fontFamily: "medium",
		letterSpacing: 0.3,
		color: colors.textColor,
	},
});

export default MyStatus;
