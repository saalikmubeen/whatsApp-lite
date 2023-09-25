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

const { width, height } = Dimensions.get("window");

function getTimeAgoOrTime(dateStr: string) {
	const currentDate = new Date();
	const inputDate = new Date(dateStr);
	const timeDifference = currentDate.valueOf() - inputDate.valueOf();

	const millisecondsInDay = 24 * 60 * 60 * 1000;
	const daysAgo = Math.floor(timeDifference / millisecondsInDay);

	if (daysAgo === 0) {
		// Within the same day, return the time in 12-hour format with AM/PM
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	} else if (daysAgo === 1) {
		// Yesterday
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `Yesterday ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	} else if (daysAgo <= 10) {
		// Within 10 days
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${daysAgo} days ago at ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	} else {
		// More than 10 days ago, return the full date and time
		const day = inputDate.getDate();
		const month = inputDate.toLocaleString("default", { month: "short" });
		const year = inputDate.getFullYear();
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${day} ${month} ${year} ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	}
}

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
