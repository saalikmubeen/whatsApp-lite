import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import Input from "./Input";
import { reducer } from "../utils/reducers/formReducer";
import { validateInput } from "../utils/actions/formActions";
import { signUp } from "../utils/actions/authActions";
import { ActivityIndicator, Alert } from "react-native";
import { colors } from "../constants";
import { useAppDispatch } from "../utils/store";

const initialState = {
	inputValues: {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	},
	inputValidities: {
		firstName: undefined,
		lastName: undefined,
		email: undefined,
		password: undefined,
	},
	formIsValid: false,
};

const SignUpForm = () => {
	const [formState, dispatchFormState] = useReducer(reducer, initialState);
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);

	const dispatch = useAppDispatch();

	const inputChangedHandler = useCallback(
		(inputId: string, inputValue: string) => {
			const result = validateInput(inputId, inputValue);
			dispatchFormState({ inputId, validationResult: result, inputValue });
		},
		[dispatchFormState]
	);

	const authHandler = async () => {
		try {
			setError(undefined);
			setLoading(true);

			const action = signUp({
				firstName: formState.inputValues.firstName,
				lastName: formState.inputValues.lastName,
				email: formState.inputValues.email,
				password: formState.inputValues.password,
			});
			await dispatch(action);
			setLoading(false);
		} catch (err: any) {
			setError(err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (error) {
			Alert.alert("An error occurred!", error, [{ text: "Okay", onPress: () => setError(undefined) }]);
		}
	}, [error]);

	return (
		<>
			<Input
				id="firstName"
				label="First name"
				icon="user-o"
				iconPack={FontAwesome}
				onInputChanged={inputChangedHandler}
				autoCapitalize="none"
				errorText={formState.inputValidities["firstName"]}
			/>

			<Input
				id="lastName"
				label="Last name"
				icon="user-o"
				iconPack={FontAwesome}
				onInputChanged={inputChangedHandler}
				autoCapitalize="none"
				errorText={formState.inputValidities["lastName"]}
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
			/>

			<Input
				id="password"
				label="Password"
				icon="lock"
				autoCapitalize="none"
				secureTextEntry
				iconPack={Feather}
				onInputChanged={inputChangedHandler}
				errorText={formState.inputValidities["password"]}
			/>

			{loading ? (
				<ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
			) : (
				<SubmitButton title="Sign Up" onPress={authHandler} style={{ marginTop: 20 }} disabled={!formState.formIsValid} />
			)}
		</>
	);
};

export default SignUpForm;
