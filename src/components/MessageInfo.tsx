import React, { useRef } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import { colors } from "../constants";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    text: string;
    dateString: string;
    imageUrl?: string;
    isSeen: boolean;
    edited: boolean;
};

const MessageInfo = (props: Props) => {
    const { text, dateString, imageUrl, isSeen, edited } = props;
    console.log(imageUrl);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text style={styles.text}>{text}</Text>
                )}

                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {`${edited ? "Edited " : ""}`} {dateString}
                    </Text>
                    <Ionicons
                        name="md-checkmark-done-sharp"
                        size={13}
                        color={isSeen ? colors.blue : colors.gray}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E7FED6",
        borderRadius: 6,
        marginBottom: 10,
        borderColor: "#E7FED6",
        borderWidth: 1,
        maxWidth: "90%",
    },
    textContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    text: {
        fontFamily: "regular",
        letterSpacing: 0.3,
        color: colors.textColor,
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 2,
        marginTop: 3,
    },
    time: {
        fontFamily: "regular",
        letterSpacing: 0.1,
        color: colors.gray,
        fontSize: 12,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 5,
    },
});

export default MessageInfo;
