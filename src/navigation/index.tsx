import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoggedInNavigator from "./LoggedInNavigator";
import LoggedOutNavigator from "./LoggedOutNavigator";
import { useAppSelector } from "../utils/store";
import StartUpScreen from "../screens/StartUp.Screen";

const AppNavigator = () => {
    const isAuth = useAppSelector(
        (state) => state.auth.token !== null && state.auth.token !== ""
    );
    const didTryAutoLogin = useAppSelector(
        (state) => state.auth.didTryAutoLogin
    );

    return (
        <NavigationContainer>
            {isAuth ? (
                <LoggedInNavigator />
            ) : didTryAutoLogin ? (
                <LoggedOutNavigator />
            ) : (
                <StartUpScreen />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
