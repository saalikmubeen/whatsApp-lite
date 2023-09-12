import React, { useLayoutEffect, useState, useEffect } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import { colors, commonStyles } from "../constants";
import { FontAwesome } from "@expo/vector-icons";
import { searchUsers } from "../utils/actions/userActions";
import UserItem from "../components/UserItem";
import { useAppSelector } from "../utils/store";
import { UserData } from "../utils/store/types";

type Props = StackScreenProps<LoggedInStackParamList>;

type Users = {
	[K in UserData["userId"]]: UserData;
};

const NewChatScreen = (props: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState<Users>({});
	const [noResultsFound, setNoResultsFound] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const userId = useAppSelector((state) => state.auth.userData?.userId);

	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerLeft: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item title="Close" iconName="close" onPress={() => props.navigation.goBack()} />
					</HeaderButtons>
				);
			},
			headerTitle: "New Chat",
		});
	}, []);

	useEffect(() => {
		const delaySearch = setTimeout(async () => {
			if (!searchTerm || searchTerm === "") {
				setUsers({});
				setNoResultsFound(false);
				setIsLoading(false);
				return;
			}

			setIsLoading(true);

			const usersResult = await searchUsers(searchTerm);

			// Remove the current logged in user from the search list
			if (userId) {
				delete usersResult[userId];
			}
			setUsers(usersResult);

			if (Object.keys(usersResult).length === 0) {
				setNoResultsFound(true);
			} else {
				setNoResultsFound(false);
			}

			setIsLoading(false);
		}, 650);

		return () => clearTimeout(delaySearch);
	}, [searchTerm]);

	return (
		<PageContainer>
			<View style={styles.searchContainer}>
				<FontAwesome name="search" size={15} color={colors.lightGray} />

				<TextInput placeholder="Search" style={styles.searchBox} onChangeText={(text: string) => setSearchTerm(text)} />
			</View>

			{isLoading && (
				<View style={commonStyles.center}>
					<ActivityIndicator size={"large"} color={colors.primary} />
				</View>
			)}

			{!isLoading && !noResultsFound && (
				<FlatList
					data={Object.keys(users)}
					renderItem={(itemData) => {
						const userId = itemData.item;
						const userData = users[userId];

						return (
							<UserItem
								title={`${userData.firstName} ${userData.lastName}`}
								subTitle={userData.about}
								image={userData.profilePicture}
							/>
						);
					}}
				/>
			)}

			{!isLoading && noResultsFound && (
				<View style={commonStyles.center}>
					<FontAwesome name="question" size={55} color={colors.lightGray} style={styles.noResultsIcon} />
					<Text style={styles.noResultsText}>No users found!</Text>
				</View>
			)}

			{!isLoading && !noResultsFound && (
				<View style={commonStyles.center}>
					<FontAwesome name="users" size={55} color={colors.lightGray} style={styles.noResultsIcon} />
					<Text style={styles.noResultsText}>Enter a name to search for a user!</Text>
				</View>
			)}
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.extraLightGrey,
		height: 50,
		marginVertical: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 8,
	},
	searchBox: {
		marginLeft: 8,
		fontSize: 15,
		width: "100%",
		height: 50,
	},
	noResultsIcon: {
		marginBottom: 20,
	},
	noResultsText: {
		color: colors.textColor,
		fontFamily: "regular",
		letterSpacing: 0.3,
	},
});

export default NewChatScreen;
