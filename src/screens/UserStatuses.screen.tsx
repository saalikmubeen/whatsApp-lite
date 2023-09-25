import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Button, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { LoggedInStackParamList } from "../navigation/types";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Status } from "../utils/store/types";
import { colors } from "../constants";
import { deleteUserStatus, updateStatusViews } from "../utils/actions/statusActions";
import { useAppSelector } from "../utils/store";
import BottomModal from "../components/BottomModal";
import { getTimeAgoOrTime } from "../utils/helperFns";

const { width, height } = Dimensions.get("window");

type Props = StackScreenProps<LoggedInStackParamList, "UserStatuses">;

const UserStatusesScreen = (props: Props) => {
	const { userId, username, statuses } = props.route.params;
	const loggedInUser = useAppSelector((state) => state.auth.userData)!;

	const [currentStatusIndex, setCurrentStatusIndex] = React.useState(0);

	const _renderItem = ({ item, index }: { index: number; item: Status }) => {
		const statusViews = () => {
			props.navigation.navigate("Views", {
				statusId: item.statusId,
			});
		};

		const deleteStatus = async () => {
			await deleteUserStatus({
				statusId: item.statusId,
				userId: loggedInUser.userId,
			});
			props.navigation.goBack();
		};

		return (
			<View>
				<Image source={{ uri: item.imageUrl }} style={{ width: width, height: height }} />
				{
					// if looged in user is the same as the user whose statuses are being viewed
					// show delete button
					loggedInUser.userId === userId && <BottomModal statusViews={statusViews} deleteStatus={deleteStatus} />
				}
			</View>
		);
	};

	useEffect(() => {
		const currentStatus = statuses[currentStatusIndex];
		props.navigation.setOptions({
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item title="Close" iconName="close" onPress={() => props.navigation.goBack()} />
					</HeaderButtons>
				);
			},
			headerLeft: () => {
				return null;
			},
			headerTitle: () => {
				return (
					<View style={{ justifyContent: "center", alignItems: "center" }}>
						<Text style={styles.heading}>
							{username} ({statuses.length})
						</Text>
						<Text>{getTimeAgoOrTime(currentStatus.createdAt)}</Text>
					</View>
				);
			},
		});
	}, [username, currentStatusIndex]);

	useEffect(() => {
		// user is viewing his/her own status
		if (userId === loggedInUser.userId) {
			return;
		}

		const currentStatusViews = statuses[currentStatusIndex].views;
		const currentStatusViewers = Object.values(currentStatusViews || {});

		// user has already viewed this status
		if (currentStatusViewers.includes(loggedInUser.userId)) {
			return;
		}

		updateStatusViews({
			statusId: statuses[currentStatusIndex].statusId,
			userId: userId, // the userId whose status is being viewed
			viewerId: loggedInUser.userId,
		});
	}, [currentStatusIndex]);

	return (
		<Carousel
			// ref={(c) => {
			// 	this._carousel = c;
			// }}
			data={statuses}
			renderItem={_renderItem}
			sliderWidth={width}
			itemWidth={width}
			// sliderHeight={900}
			// itemHeight={900}
			layout="default"
			loop
			useScrollView
			onSnapToItem={(index) => {
				setCurrentStatusIndex(index);
			}}
		/>
	);
};

const styles = StyleSheet.create({
	heading: {
		color: colors.textColor,
		fontFamily: "bold",
		fontSize: 16,
		letterSpacing: 0.3,
	},
});

export default UserStatusesScreen;
