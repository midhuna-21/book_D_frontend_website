export const validateEmail = (email: string) => {
    return email.trim() !== "";
};

export const validatePassword = (password: string) => {
    return password.trim() !== "";
};

export const isValidateLogin = (email: string, password: string) => {
    if (!validateEmail(email)) {
        return "Please enter  email.";
    }

    if (!validatePassword(password)) {
        return "Please enter password.";
    }

    return true;
};
