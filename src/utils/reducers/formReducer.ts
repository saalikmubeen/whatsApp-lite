type State = {
	inputValues: {
		[key: string]: string;
	};
	inputValidities: {
		[key: string]: undefined | string[];
	};
	formIsValid: boolean;
};

type Action = {
	validationResult: undefined | string[];
	inputId: string;
	inputValue: string;
};

export function reducer(state: State, action: Action) {
	const { validationResult, inputId, inputValue } = action;

	const updatedValues = {
		...state.inputValues,
		[inputId]: inputValue,
	};

	const updatedValidities = {
		...state.inputValidities,
		[inputId]: validationResult,
	};

	let updatedFormIsValid = true;

	for (const key in updatedValidities) {
		if (updatedValidities[key] !== undefined) {
			updatedFormIsValid = false;
			break;
		}
	}

	return {
		inputValues: updatedValues,
		inputValidities: updatedValidities,
		formIsValid: updatedFormIsValid,
	};
}
