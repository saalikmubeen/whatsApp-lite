import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
	children: React.ReactNode;
	styles?: ViewStyle;
};

const PageContainer = (props: Props) => {
	return <View style={{ ...styles.container, ...props.styles }}>{props.children}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 20,
	},
});

export default PageContainer;
