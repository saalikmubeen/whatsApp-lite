import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChatListScreen from "../screens/ChatList.screen";
import SettingsScreen from "../screens/Settings.screen";
import { LoggedInStackParamList, LoggedInTabParamList } from "./types";
import ChatSettingsScreen from "../screens/ChatSettings.screen";
import ChatScreen from "../screens/Chat.Screen";
import NewChatScreen from "../screens/NewChat.Screen";

const Stack = createStackNavigator<LoggedInStackParamList>();

const Tab = createBottomTabNavigator<LoggedInTabParamList>();

const TabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerTitle: "",
				headerShadowVisible: false,
			}}
			initialRouteName="Settings"
		>
			<Tab.Screen
				name="ChatList"
				component={ChatListScreen}
				options={{
					tabBarLabel: "Chats",
					tabBarIcon: ({ color, size }) => {
						return <Ionicons name="chatbubbles" size={size} color={color} />;
					},
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarLabel: "Settings",
					tabBarIcon: ({ color, size }) => {
						return <Ionicons name="settings" size={size} color={color} />;
					},
				}}
			/>
		</Tab.Navigator>
	);
};

const LoggedInNavigator = () => {
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
					initialParams={{
						userId: "1",
					}}
					component={ChatSettingsScreen}
					options={{
						headerTitle: "ChatSettings",
						headerBackTitle: "Back",
					}}
				/>
				<Stack.Screen
					name="Chat"
					initialParams={{
						userId: "1",
					}}
					component={ChatScreen}
					options={{
						headerTitle: "Chat",
						headerBackTitle: "Back",
					}}
				/>
			</Stack.Group>

			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="NewChat" component={NewChatScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default LoggedInNavigator;
