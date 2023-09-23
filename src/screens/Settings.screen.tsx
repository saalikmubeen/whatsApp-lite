import React, { useCallback, useReducer, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import SubmitButton from "../components/SubmitButton";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { updateSignedInUserData, userLogout } from "../utils/actions/authActions";
import { colors } from "../constants";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { updateLoggedInUserData } from "../utils/store/authSlice";
import ProfileImage from "../components/ProfileImage";

const SettingsScreen = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
	const userData = useAppSelector((state) => state.auth.userData)!;

	const firstName = userData?.firstName || "";
	const lastName = userData?.lastName || "";
	const email = userData?.email || "";
	const about = userData?.about || "";

	const initialState = {
		inputValues: {
			firstName,
			lastName,
			email,
			about,
		},
		inputValidities: {
			firstName: undefined,
			lastName: undefined,
			email: undefined,
			about: undefined,
		},
		formIsValid: false,
	};

	const [formState, dispatchFormState] = useReducer(reducer, initialState);

	const dispatch = useAppDispatch();

	const inputChangedHandler = useCallback(
		(inputId: string, inputValue: string) => {
			const result = validateInput(inputId, inputValue);
			dispatchFormState({ inputId, validationResult: result, inputValue });
		},
		[dispatchFormState]
	);

	const saveHandler = useCallback(async () => {
		const updatedValues = formState.inputValues;

		try {
			if (userData) {
				setLoading(true);
				await updateSignedInUserData(userData.userId, updatedValues);
				dispatch(updateLoggedInUserData({ newData: updatedValues }));

				setShowSuccessMessage(true);

				setTimeout(() => {
					setShowSuccessMessage(false);
				}, 3000);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, [formState, dispatch]);

	const hasChanges = () => {
		const currentValues = formState.inputValues;

		return (
			currentValues.firstName != firstName || currentValues.lastName != lastName || currentValues.email != email || currentValues.about != about
		);
	};

	return (
		<PageContainer>
			<PageTitle text="Settings" />

			<ScrollView contentContainerStyle={styles.formContainer}>
				{userData && <ProfileImage size={80} userId={userData.userId} uri={userData.profilePicture} />}

				<Input
					id="firstName"
					label="First name"
					icon="user-o"
					iconPack={FontAwesome}
					onInputChanged={inputChangedHandler}
					autoCapitalize="none"
					errorText={formState.inputValidities["firstName"]}
					initialValue={userData?.firstName}
				/>

				<Input
					id="lastName"
					label="Last name"
					icon="user-o"
					iconPack={FontAwesome}
					onInputChanged={inputChangedHandler}
					autoCapitalize="none"
					errorText={formState.inputValidities["lastName"]}
					initialValue={userData?.lastName}
				/>

				<Input
					id="email"
					label="Email"
					icon="mail"
					iconPack={Feather}
					onInputChanged={inputChangedHandler}
					keyboardType="email-address"
					autoCapitalize="none"
					errorText={formState.inputValidities["email"]}
					initialValue={userData?.email}
				/>

				<Input
					id="about"
					label="About"
					icon="user-o"
					iconPack={FontAwesome}
					onInputChanged={inputChangedHandler}
					autoCapitalize="none"
					errorText={formState.inputValidities["about"]}
					initialValue={userData?.about}
				/>

				<View style={{ marginTop: 20, width: "100%" }}>
					{showSuccessMessage && <Text>Saved!</Text>}

					{loading ? (
						<ActivityIndicator size={"small"} color={colors.primary} style={{ marginTop: 10 }} />
					) : (
						hasChanges() && <SubmitButton title="Save" onPress={saveHandler} style={styles.button} disabled={!formState.formIsValid} />
					)}
				</View>

				<SubmitButton title="Logout" onPress={() => dispatch(userLogout(userData.userId))} style={styles.button} color={colors.red} />
			</ScrollView>
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	formContainer: {
		alignItems: "center",
	},
	button: {
		marginTop: 20,
		width: "100%",
	},
});

export default SettingsScreen;
