export const validatePassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d).{6,}$/;
    return strongPasswordRegex.test(password);
};

export const validateConfirmPassword = (
    password: string,
    confirmPassword: string
): boolean => {
    return password === confirmPassword;
};

export const isValidatePasswords = (
    password: string,
    confirmPassword: string
) => {
    if (!validatePassword(password)) {
        return "Please enter strong password.";
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
        return "Confirm password does not match password";
    }
    return true;
};
