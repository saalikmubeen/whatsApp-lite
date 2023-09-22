import { validateEmail, validateLength, validatePassword, validateString } from "../validationConstraints";

type ValidateFn = (id: string, value: string) => undefined | string[];

export const validateInput: ValidateFn = (inputId, inputValue) => {
	if (inputId === "firstName" || inputId === "lastName") {
		return validateString(inputId, inputValue);
	} else if (inputId === "email") {
		return validateEmail(inputId, inputValue);
	} else if (inputId === "password") {
		return validatePassword(inputId, inputValue);
	} else if (inputId === "about") {
		return validateLength(inputId, inputValue, 0, 150, true);
	} else if (inputId === "chatName") {
		return validateLength(inputId, inputValue, 5, 50, false);
	}
};
