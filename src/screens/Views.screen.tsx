import { Animated, View, Text, Pressable, StyleSheet, useWindowDimensions, Button, FlatList } from "react-native";
import { StackScreenProps, useCardAnimation } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";
import { useAppSelector } from "../utils/store";
import PageContainer from "../components/PageContainer";
import UserItem from "../components/UserItem";
import { colors } from "../constants";
import { Ionicons } from "@expo/vector-icons";

type Props = StackScreenProps<LoggedInStackParamList, "Views">;

function ViewsScreen({ navigation, route }: Props) {
	const { height } = useWindowDimensions();
	const { current } = useCardAnimation();

	const statusId = route.params.statusId;
	const myStatuses = useAppSelector((state) => state.statuses.myStatuses);
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const status = myStatuses.find((status) => status.statusId === statusId);

	const views = status?.views || {};
	const statusViews = Object.values(views).map((view) => {
		const user = storedUsers[view];
		return user;
	});

	return (
		<View style={{ flex: 1 }}>
			<Pressable style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} onPress={navigation.goBack} />
			<Animated.View
				style={[
					{
						height: height,
						transform: [
							{
								translateY: current.progress.interpolate({
									inputRange: [0, 1],
									outputRange: [height, height * 0.5],
									extrapolate: "clamp",
								}),
							},
						],
					},
					styles.viewAnimated,
				]}
			>
				<PageContainer styles={{ borderRadius: 20 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: 20,
							marginBottom: 20,
						}}
					>
						<Text style={styles.heading}>VIEWS {`(${statusViews.length})`}</Text>
						<Ionicons name="ios-close" size={24} color="black" onPress={navigation.goBack} />
					</View>

					{statusViews.length > 0 ? (
						<FlatList
							data={statusViews}
							renderItem={(itemData) => {
								const viewUser = itemData.item;

								let title = `${viewUser.firstName} ${viewUser.lastName}`;
								const subTitle = viewUser.about;
								let image = viewUser.profilePicture;

								return (
									<UserItem
										title={title}
										subTitle={subTitle}
										image={image}
										onPress={() =>
											navigation.navigate("Contact", {
												userId: viewUser.userId,
											})
										}
										type="user"
									/>
								);
							}}
						/>
					) : (
						<View style={{ alignItems: "center", justifyContent: "center" }}>
							<Text style={styles.text}>No views yet.</Text>
						</View>
					)}
				</PageContainer>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	viewAnimated: {
		width: "100%",
	},
	heading: {
		color: colors.textColor,
		fontFamily: "bold",
		fontSize: 16,
		letterSpacing: 0.3,
	},
	text: {
		color: colors.textColor,
		fontSize: 18,
		letterSpacing: 0.3,
	},
});

export default ViewsScreen;
