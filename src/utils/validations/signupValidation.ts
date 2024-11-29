export const validateName = (name: string) => {   
    const trimmedName = name.trim().replace(/\s+/g, ' '); 
    const validNamePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    return validNamePattern.test(trimmedName);
};

export const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
export const validatePhone = (phone: string) => {
    const regex = /^(?!.*(.)\1{2})\d{10}$/;
    return regex.test(phone);
};

export const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d)(?!.*\s).{6,}$/;
    return passwordRegex.test(password);
};

export const validateConfirmPassword = (
    password: string,
    confirmPassword: string
): boolean => {
    return password === confirmPassword;
};

export const validate = (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
) => {
    if (!validateName(name)) {
        return "Please enter a valid name.";
    }

    if (!validateEmail(email)) {
        return "Please enter a valid email address.";
    }
    if (!validatePhone(phone)) {
        return "Please enter valid phone number";
    }
    if (!validatePassword(password)) {
        return "Please enter strong password.";
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
        if (!confirmPassword.trim()) {
            return "Enter Confirm Password";
        }
        return "Confirm password does not match password";
    }

    return true;
};
