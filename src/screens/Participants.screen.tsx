import React from "react";
import { FlatList } from "react-native";
import { useAppSelector } from "../utils/store";
import PageContainer from "../components/PageContainer";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";
import UserItem from "../components/UserItem";

type Props = StackScreenProps<LoggedInStackParamList, "Participants">;

const ParticipantsScreen = (props: Props) => {
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const userData = useAppSelector((state) => state.auth.userData)!;

	const { participants, chatId } = props.route.params;

	return (
		<PageContainer>
			<FlatList
				data={participants}
				keyExtractor={(item) => item}
				renderItem={(itemData) => {
					const uid = itemData.item;
					const currentUser = storedUsers[uid];

					if (!currentUser) return null;

					const isLoggedInUser = uid === userData.userId;

					let key = uid;
					let image = currentUser.profilePicture;
					let title = isLoggedInUser ? "You" : `${currentUser.firstName} ${currentUser.lastName}`;
					let subTitle = currentUser.about;
					let onPress = isLoggedInUser ? undefined : () => props.navigation.navigate("Contact", { userId: uid, chatId });

					return (
						<UserItem
							key={key}
							onPress={onPress}
							image={image}
							title={title}
							subTitle={subTitle}
							type={isLoggedInUser ? "user" : "link"}
						/>
					);
				}}
			/>
		</PageContainer>
	);
};

export default ParticipantsScreen;
