import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TextInputProps,
} from "react-native";
import {
    FontAwesome,
    MaterialCommunityIcons,
    MaterialIcons,
    Ionicons,
    Feather,
} from "@expo/vector-icons";

import { colors } from "../constants";

// type Icon = typeof FontAwesome | typeof MaterialCommunityIcons | typeof MaterialIcons | typeof Ionicons | typeof Feather;

type Props = TextInputProps & {
    id: string;
    label: string;
    icon?: any;
    iconPack?: any;
    iconSize?: number;
    errorText: string[] | undefined;
    onInputChanged: (inputId: string, inputValue: string) => void;
    initialValue?: string;
};

const Input = (props: Props) => {
    const IconPack = props.iconPack;

    const [value, setValue] = useState(props.initialValue);

    const onChangeText = (text: string) => {
        setValue(text);
        props.onInputChanged(props.id, text);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <View style={styles.inputContainer}>
                {IconPack && props.icon && (
                    <IconPack
                        name={props.icon}
                        size={props.iconSize || 15}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={value}
                    {...props}
                />
            </View>

            {props.errorText && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText[0]}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    label: {
        fontFamily: "bold",
        // fontSize: 16,
        marginVertical: 8,
        letterSpacing: 0.3,
        color: colors.textColor,
    },
    input: {
        flex: 1,
        height: 50,
        color: colors.textColor,
        fontFamily: "regular",
        letterSpacing: 0.3,
        paddingTop: 0,
    },
    inputContainer: {
        backgroundColor: colors.almostWhite,
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 50,
        borderRadius: 8,
        borderColor: "#000",
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginRight: 10,
        color: colors.gray,
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: "red",
        fontSize: 13,
        fontFamily: "regular",
        letterSpacing: 0.3,
    },
});

export default Input;
