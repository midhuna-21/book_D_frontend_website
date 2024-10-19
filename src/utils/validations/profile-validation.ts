export const validateName = (name: string) => {
    if (name.trim() === "") {
        return "Please enter a name.";
    }
    if (name.length > 50) {
        return "Name should not exceed 50 characters.";
    }
    const invalidCharacters = /[$%^@#&*]/;
    if (invalidCharacters.test(name)) {
        return "Please enter a valid name.";
    }
    return true;
};

export const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() == "") {
        return "Please enter email";
    } else if (!regex.test(email)) {
        return "Please provide valid email";
    }
    return true;
};

export const validatePhone = (phone: string) => {
    if (phone.trim() === "") {
        return true;
    }
    if (phone.length !== 10) {
        return "Phone number should be 10 digits long.";
    }
    const regex = /^(?!.*(.)\1{4})\d{10}$/;
    if (!regex.test(phone)) {
        return "Please enter a valid phone number.";
    }
    return true;
};

export const validateStreet = (street: string) => {
    if (street.length > 100) {
        return "street should not exceed 100 characters.";
    }
    return true;
};
export const validateCity = (city: string) => {
    if (city.length > 100) {
        return "City should not exceed 100 characters.";
    }
    return true;
};

export const validateDistrict = (district: string) => {
    if (district.length > 100) {
        return "District should not exceed 100 characters.";
    }
    return true;
};

export const validateState = (state: string) => {
    if (state.length > 100) {
        return "State should not exceed 100 characters.";
    }
    return true;
};

export const validatePincode = (pincode: string) => {
    if (pincode.length > 6) {
        return "Pincode should not exceed more than 6 number.";
    }
    return true;
};

export const validate = (
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    district: string,
    state: string,
    pincode: string,
    isGoogle: boolean
) => {
    const nameValidationResult = validateName(name);
    if (nameValidationResult !== true) {
        return nameValidationResult;
    }
    if (!isGoogle) {
        const emailValidationResult = validateEmail(email);
        if (emailValidationResult !== true) {
            return emailValidationResult;
        }
    }
    const phoneValidationResult = validatePhone(phone);
    if (phoneValidationResult !== true) {
        return phoneValidationResult;
    }
    const streetValidationResult = validateStreet(street);
    if (streetValidationResult !== true) {
        return streetValidationResult;
    }
    const cityValidationResult = validateCity(city);
    if (cityValidationResult !== true) {
        return cityValidationResult;
    }

    const districtValidationResult = validateDistrict(district);
    if (districtValidationResult !== true) {
        return districtValidationResult;
    }
    const stateValidationResult = validateState(state);
    if (stateValidationResult !== true) {
        return stateValidationResult;
    }
    const pincodeValidationResult = validatePincode(pincode);
    if (pincodeValidationResult !== true) {
        return pincodeValidationResult;
    }
    return true;
};
