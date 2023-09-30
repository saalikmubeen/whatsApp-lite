import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants";
import PageContainer from "../components/PageContainer";
import ProfileImage from "../components/ProfileImage";
import PageTitle from "../components/PageTitle";
import { useAppSelector } from "../utils/store";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";
import UserImage from "../components/UserImage";
import { getUserChats, removeUserFromChat } from "../utils/actions/chatActions";
import UserItem from "../components/UserItem";
import SubmitButton from "../components/SubmitButton";

type Props = StackScreenProps<LoggedInStackParamList, "Contact">;

const ContactScreen = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [commonChats, setCommonChats] = useState<string[]>([]);
    const storedUsers = useAppSelector(
        (state) => state.storedUsers.storedUsers
    );
    const userData = useAppSelector((state) => state.auth.userData)!;
    const storedChats = useAppSelector((state) => state.chats.chatsData);
    const currentUser = storedUsers[props.route.params.userId];

    const chatId = props.route.params.chatId;
    const chatData = chatId && storedChats[chatId];

    const removeFromChat = useCallback(async () => {
        try {
            setIsLoading(true);

            if (chatData) {
                await removeUserFromChat({
                    chatData,
                    userLoggedInData: userData,
                    userToRemoveData: currentUser,
                });
            }

            props.navigation.goBack();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [props.navigation, isLoading]);

    useEffect(() => {
        const getCommonUserChats = async () => {
            const currentUserChats = await getUserChats(currentUser.userId);
            const currentUserChatsIds: string[] =
                Object.values(currentUserChats);
            const commonChatIds = currentUserChatsIds.filter(
                (cid) => storedChats[cid] && storedChats[cid].isGroupChat
            );
            setCommonChats(commonChatIds);
        };

        getCommonUserChats();
    }, []);

    return (
        <PageContainer>
            <View style={styles.topContainer}>
                <UserImage
                    uri={currentUser.profilePicture}
                    size={80}
                    styles={{ marginBottom: 20 }}
                />

                <PageTitle
                    text={`${currentUser.firstName} ${currentUser.lastName}`}
                />
                {currentUser.about && (
                    <Text style={styles.about} numberOfLines={2}>
                        {currentUser.about}
                    </Text>
                )}
            </View>

            {commonChats.length > 0 && (
                <>
                    <Text style={styles.heading}>
                        {commonChats.length}{" "}
                        {commonChats.length === 1 ? "Group" : "Groups"} in
                        Common
                    </Text>
                    {commonChats.map((cid) => {
                        const chatData = storedChats[cid];
                        return (
                            <UserItem
                                key={cid}
                                title={chatData.chatName!}
                                subTitle={chatData.latestMessageText}
                                type="link"
                                onPress={() =>
                                    props.navigation.push("Chat", {
                                        chatId: cid,
                                    })
                                }
                                image={chatData.chatImage}
                            />
                        );
                    })}
                </>
            )}

            {chatData && chatData.isGroupChat && (
                <View style={{ marginTop: 20 }}>
                    {isLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                        />
                    ) : (
                        <SubmitButton
                            title="Remove from chat"
                            color={colors.red}
                            onPress={removeFromChat}
                        />
                    )}
                </View>
            )}
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    about: {
        fontFamily: "medium",
        fontSize: 16,
        letterSpacing: 0.3,
        color: colors.gray,
    },
    heading: {
        fontFamily: "bold",
        letterSpacing: 0.3,
        color: colors.textColor,
        marginVertical: 8,
    },
});

export default ContactScreen;
