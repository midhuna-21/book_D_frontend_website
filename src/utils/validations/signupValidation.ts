
export const validateName = (name: string) => {
   const trimmedName = name.trim();
   const invalidCharacters = /[$%^@#&*]/;
 
   return trimmedName !== '' && !invalidCharacters.test(trimmedName)
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
   const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d).{6,}$/;
   return passwordRegex.test(password);
};

export const validateConfirmPassword = (password: string,conformPassword:string): boolean => {
   return password === conformPassword
};

export const validate = (name:string, email:string,phone:string, password:string,confirmPassword:string) => {
   if (!validateName(name)) {
       return 'Please enter a valid name.';
   }

   if (!validateEmail(email)) {
       return 'Please enter a valid email address.';
   }
   if(!validatePhone(phone)){
      return 'Please enter valid phone number'
   }
   if (!validatePassword(password)) {
       return 'Please enter strong password.';
   }
   if(!validateConfirmPassword(password,confirmPassword)){
      if(!confirmPassword.trim()){
         return "Enter Conform Password"
      }
      return "Conform password does not match password"
   }

   return true; 
};
