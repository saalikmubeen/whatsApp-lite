import React from "react";
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import ProfileImage from "./ProfileImage";
import { colors } from "../constants";
import UserImage from "./UserImage";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const IMAGE_SIZE = 40;

type Props = {
    title: string;
    subTitle?: string;
    image?: string;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    isChecked?: boolean;
    type: "user" | "group" | "link" | "button";
    icon?: any;
    hideImage?: boolean;
};

const UserItem = (props: Props) => {
    const {
        title,
        subTitle,
        image,
        onPress,
        isChecked,
        type,
        icon,
        hideImage,
    } = props;

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.container}>
                {icon ? (
                    <View style={styles.leftIconContainer}>
                        <AntDesign name={icon} size={20} color={colors.blue} />
                    </View>
                ) : hideImage ? null : (
                    <UserImage uri={image} size={40} />
                )}

                <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.title}>
                        {title}
                    </Text>

                    {subTitle && (
                        <Text numberOfLines={1} style={styles.subTitle}>
                            {subTitle}
                        </Text>
                    )}
                </View>

                {type === "group" && (
                    <View
                        style={{
                            ...styles.iconContainer,
                            ...(isChecked && styles.checkedStyle),
                        }}
                    >
                        <Ionicons name="checkmark" size={18} color="white" />
                    </View>
                )}

                {type === "link" && (
                    <View>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={18}
                            color={colors.gray}
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 7,
        borderBottomColor: colors.extraLightGrey,
        borderBottomWidth: 1,
        alignItems: "center",
        minHeight: 50,
    },
    textContainer: {
        marginLeft: 14,
        flex: 1,
    },
    title: {
        fontFamily: "medium",
        fontSize: 16,
        letterSpacing: 0.3,
    },
    subTitle: {
        fontFamily: "regular",
        color: colors.gray,
        letterSpacing: 0.3,
    },
    iconContainer: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGray,
        backgroundColor: "white",
    },
    checkedStyle: {
        backgroundColor: colors.primary,
        borderColor: "transparent",
    },
    leftIconContainer: {
        backgroundColor: colors.extraLightGrey,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
});

export default UserItem;
