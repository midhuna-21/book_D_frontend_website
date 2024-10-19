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

// export const validatePhone = (phone: string) => {
//    const regex = /^(?!.*(.)\1{2})\d{10}$/;
//    return regex.test(phone);
// };

// export const validatePhoneNumber = (phone:string,) => {
//    if (!validatePhone(phone)) {
//        return 'Please enter a valid phone number.';
//    }
//    return true
// }
