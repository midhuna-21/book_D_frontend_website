export const validatePassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d).{6,}$/;
    return strongPasswordRegex.test(password);
};

export const validateConformPassword = (
    password: string,
    conformPassword: string
): boolean => {
    return password === conformPassword;
};

export const isValidatePasswords = (
    password: string,
    conformPassword: string
) => {
    if (!validatePassword(password)) {
        return "Please enter strong password.";
    }
    if (!validateConformPassword(password, conformPassword)) {
        return "Confirm password does not match password";
    }
    return true;
};
