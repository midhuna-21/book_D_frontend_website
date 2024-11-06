export const isvalidateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validateEmail = (email: string) => {
    if (!isvalidateEmail(email)) {
        return "Please enter a valid email address.";
    }
    return true;
};
