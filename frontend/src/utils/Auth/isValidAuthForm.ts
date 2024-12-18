import { LoginFormType, RegisterFormType } from "../../types/auth";

export const isValidRegisterForm = (formData: RegisterFormType): boolean => {
    const { firstName, lastName, email, password, repeatPassword } = formData;
    const areFieldsFilled =
        !!firstName.trim() && !!lastName.trim() && !!email.trim() && !!password.trim() && !!repeatPassword.trim();

    const doPasswordsMatch = password === repeatPassword;

    return areFieldsFilled && doPasswordsMatch;
};

export const isValidLoginForm = (formData: LoginFormType): boolean => {
    return !!formData.email.trim() && !!formData.password.trim();
};
