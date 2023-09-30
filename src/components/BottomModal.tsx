import React, { useState } from "react";
import { Dimensions, Modal, StyleSheet, View } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants";

const { width, height } = Dimensions.get("window");

type Props = {
    statusViews: () => void;
    deleteStatus: () => void;
};

const BottomModal = (props: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            {!modalVisible && (
                <View style={styles.showModalIconContainer}>
                    <FontAwesome
                        name="chevron-up"
                        size={20}
                        color="black"
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    />
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    <View style={styles.iconsContainer}>
                        <Ionicons
                            name="eye"
                            size={24}
                            onPress={() => {
                                setModalVisible(false);
                                props.statusViews();
                            }}
                        />
                        <MaterialIcons
                            name="delete"
                            size={24}
                            onPress={props.deleteStatus}
                        />
                        <FontAwesome
                            name="chevron-down"
                            size={22}
                            color="black"
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default BottomModal;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 50,
        bottom: 160,
        left: width / 2 - 33,
    },

    showModalIconContainer: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        top: "92%",
        height: "8%",
        backgroundColor: colors.extraLightGrey,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
});
