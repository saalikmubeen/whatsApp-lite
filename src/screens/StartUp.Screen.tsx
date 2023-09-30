import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "../utils/store";
import { authenticate, setDidTryAutoLogin } from "../utils/store/authSlice";
import { getUserData } from "../utils/actions/authActions";
import { ActivityIndicator, View } from "react-native";
import { colors, commonStyles } from "../constants";

const StartUpScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const storedAuthInfo = await AsyncStorage.getItem("userData");

            if (!storedAuthInfo) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const parsedData = JSON.parse(storedAuthInfo);
            const { token, userId, expiryDate: expiryDateString } = parsedData;

            const expiryDate = new Date(expiryDateString);

            // If the token is expired or there is no token or userId, then we don't want to auto-login
            if (expiryDate <= new Date() || !token || !userId) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const userData = await getUserData(userId);
            dispatch(authenticate({ token: token, userData }));
        };

        tryLogin();
    }, [dispatch]);

    return (
        <View style={commonStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

export default StartUpScreen;
