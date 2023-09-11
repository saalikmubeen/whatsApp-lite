import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants";

type Props = {
	text: string;
};

const PageTitle = (props: Props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{props.text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	text: {
		fontSize: 28,
		color: colors.textColor,
		fontFamily: "bold",
		letterSpacing: 0.3,
	},
});

export default PageTitle;
