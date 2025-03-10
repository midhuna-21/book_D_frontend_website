const disallowedCharacters = /[^a-zA-Z0-9\s.,-]/;

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
    const regex = /^(?!.*(.)\1{6})\d{10}$/;
    if (!regex.test(phone)) {
        return "Please enter a valid phone number.";
    }
    return true;
};

export const validateStreet = (street: string) => {
    if (street.length > 100) {
        return "street should not exceed 100 characters.";
    }
    if (disallowedCharacters.test(street)) {
        return "Please provide valid street address.";
    }
    return true;
};
export const validateCity = (city: string) => {
    if (city.length > 100) {
        return "City should not exceed 100 characters.";
    }
    if (disallowedCharacters.test(city)) {
        return "Please provide valid city address.";
    }
    return true;
};

export const validateDistrict = (district: string) => {
    if (district.length > 100) {
        return "District should not exceed 100 characters.";
    }
    if (disallowedCharacters.test(district)) {
        return "Please provide valid distict.";
    }
    return true;
};

export const validateState = (state: string) => {
    if (state.length > 100) {
        return "State should not exceed 100 characters.";
    }
    if (disallowedCharacters.test(state)) {
        return "Please provide valid state.";
    }
    return true;
};

export const validatePincode = (pincode: string) => {
    const pincodeRegex = /^[0-9]{6}$/;

    if (!pincodeRegex.test(pincode)) {
        return "Please enter valid pincode.";
    }

    if (pincode === "000000") {
        return "Please enter valid pincode.";
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
