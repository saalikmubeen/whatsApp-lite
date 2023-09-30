import React from "react";
import {
    StackScreenProps,
    createStackNavigator,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import ChatListScreen from "../screens/ChatList.screen";
import SettingsScreen from "../screens/Settings.screen";
import { LoggedInStackParamList, LoggedInTabParamList } from "./types";
import ChatSettingsScreen from "../screens/ChatSettings.screen";
import ChatScreen from "../screens/Chat.Screen";
import NewChatScreen from "../screens/NewChat.Screen";
import ContactScreen from "../screens/Contact.screen";
import ParticipantsScreen from "../screens/Participants.screen";
import StatusScreen from "../screens/Status.screen";
import UserStatusesScreen from "../screens/UserStatuses.screen";
import ViewsScreen from "../screens/Views.screen";
import MessageInfoScreen from "../screens/MessageInfo.Screen";

const Stack = createStackNavigator<LoggedInStackParamList>();

const Tab = createBottomTabNavigator<LoggedInTabParamList>();

type TabNavigatorProps = StackScreenProps<LoggedInStackParamList, "Home">;

const TabNavigator = (props: TabNavigatorProps) => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitle: "",
                headerShadowVisible: false,
            }}
            initialRouteName="ChatList"
        >
            <Tab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{
                    tabBarLabel: "Chats",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Ionicons
                                name="chatbubbles"
                                size={size}
                                color={color}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Status"
                component={StatusScreen}
                options={{
                    tabBarLabel: "Status",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <FontAwesome5
                                name="instalod"
                                size={size}
                                color={color}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => {
                        return (
                            <Ionicons
                                name="settings"
                                size={size}
                                color={color}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Group>
                <Stack.Screen
                    name="Home"
                    component={TabNavigator}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ChatSettings"
                    component={ChatSettingsScreen}
                    options={{
                        headerTitle: "Chat Settings",
                        headerBackTitle: "Back",
                    }}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={{
                        headerTitle: "Chat",
                        headerBackTitle: "Back",
                    }}
                />
                <Stack.Screen
                    name="Contact"
                    component={ContactScreen}
                    options={{
                        headerTitle: "Contact Info",
                        headerBackTitle: "Back",
                    }}
                />
                <Stack.Screen
                    name="Participants"
                    component={ParticipantsScreen}
                    options={{
                        headerTitle: "Participants",
                        headerBackTitle: "Back",
                    }}
                />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="NewChat" component={NewChatScreen} />

                <Stack.Screen
                    name="UserStatuses"
                    component={UserStatusesScreen}
                />

                <Stack.Screen
                    name="MessageInfo"
                    component={MessageInfoScreen}
                    options={{
                        headerTitle: "Message Info",
                        headerBackTitle: "Back",
                    }}
                />
            </Stack.Group>

            <Stack.Group
                screenOptions={{
                    presentation: "transparentModal",
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Views" component={ViewsScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
};
