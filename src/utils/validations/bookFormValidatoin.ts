interface FormData {
    bookTitle: string;
    description: string;
    author: string;
    publisher: string;
    publishedYear: string;
    genre: string;
    customGenre?: string;
    rentalFee?: number;
    extraFee?:number
    quantity:number;
    images?: File[] | null;
   address:{
    street:string;
    city:string;
    district:string;
    state:string;
    pincode:string;
   }
    maxDistance:number;
    maxDays:number;
    minDays:number;
    latitude:number;
    longitude:number;
}


const validateFormData = (
    formData: FormData
): string[] => {
    const errors: string[] = [];

    const letterRegex = /[a-zA-Z]/;
    const digitRegex = /[0-9]/g;

    const specialCharRegex = /[^a-zA-Z0-9\s]/g;
    const nonLetterRegex = /[^a-zA-Z\s]/;
    const currentYear = new Date().getFullYear();
    const startingYear = 1440

    if (!formData.bookTitle.trim()) {
        errors.push("Please enter Book title.");
    } else if (formData.bookTitle.length > 100) {
        errors.push("Book title is too long.");
    } else if (!letterRegex.test(formData.bookTitle)) {
        errors.push("Book title must contain atleast one letter.");
    } else {
        const digits = formData.bookTitle.match(digitRegex);
        if (digits && digits.length > 5) {
            errors.push("Book title cannot contain more than 5 digits.");
        }
        const specialChars = formData.bookTitle.match(specialCharRegex);
        if (specialChars && specialChars.length > 5) {
            errors.push(
                "Book title cannot contain more than 3 special characters."
            );
        }
    }

    if (!formData.description.trim()) {
        errors.push("Please enter  Description.");
    } else if (formData.description.length > 500) {
        errors.push("Description is too long.");
    }

    if (!formData.author.trim()) {
        errors.push("Please enter Author.");
    } else if (formData.author.length > 50) {
        errors.push("Author is too long.");
    } 

    if (!formData.publisher.trim()) {
        errors.push("Please enter Publisher.");
    } else if (formData.publisher.length > 50) {
        errors.push("Publisher is too long.");
    }

    if (!formData.quantity || isNaN(formData.quantity)) {
        errors.push("Please enter quantity.");
    } else if (formData.quantity <= 0) {
        errors.push("Quantity must be a positive number.");
    }

    if (!formData.publishedYear.trim()) {
        errors.push("Please Provide Published year.");
    } else {
        const publishedYearInt = parseInt(formData.publishedYear, 10);
 
        if (isNaN(publishedYearInt) || publishedYearInt > currentYear) {
            errors.push(
                "Published year must be the current year or before the current year."
            );
        }else if(startingYear>publishedYearInt){
            errors.push("Please Provide Published year after 1440.");
        }
    }

    if (!formData.genre.trim()) {
        errors.push("Please enter Genre.");
    } else if (formData.genre.length > 50) {
        errors.push("Genre is too long.");
    }

    if (formData.genre === "Other" && !formData.customGenre?.trim()) {
        errors.push("Please enter Custom genre.");
    } else if (formData.customGenre && formData.customGenre.length > 50) {
        errors.push("Custom genre is too long.");
    }

        if (!formData.rentalFee || isNaN(formData.rentalFee)) {
            errors.push("Please enter Rental fee");
        } else if (formData.rentalFee <= 0) {
            errors.push("Rental fee must be a positive number.");
        } 

        if (!formData.extraFee || isNaN(formData.extraFee)) {
            errors.push("Please enter Extra fee.");
        }else if (formData.extraFee <= 0) {
            errors.push("Rental fee must be a positive number.");
        } 
        else if (formData.extraFee < 0) {
            errors.push("Extra fee cannot be negative.");
        }
    

    if (!formData.images || formData.images.length === 0) {
        errors.push("Upload at least one image.");
    } 

    if (!formData.address.street.trim()) {
        errors.push("Please enter Building Name.");
    } else if (formData.address.street.length > 100) {
        errors.push("Building Name is too long.");
    }

    if (!formData.address.city.trim()) {
        errors.push("Please enter City.");
    } else if (formData.address.city.length > 50) {
        errors.push("City is too long.");
    }

    if (!formData.address.district.trim()) {
        errors.push("Please enter District.");
    } else if (formData.address.district.length > 50) {
        errors.push("District is too long.");
    }

    if (!formData.address.state.trim()) {
        errors.push("Please enter State.");
    } else if (formData.address.state.length > 50) {
        errors.push("State is too long.");
    }

    if (!formData.maxDistance || isNaN(formData.maxDistance)) {
        errors.push("Please enter Maximum distance.");
    } else if (formData.quantity <= 0) {
        errors.push("Maximum distance must be a positive number.");
    }

    if (!formData.maxDays || isNaN(formData.maxDays)) {
        errors.push("Please enter Maximum Days.");
    } else if (formData.maxDays <= 0) {
        errors.push("Maximum Days must be a positive number.");
    }

    if (!formData.minDays || isNaN(formData.minDays)) {
        errors.push("Please enter Minimum Days.");
    } else if (formData.maxDays <= 0) {
        errors.push("Minimum Days must be a positive number.");
    }
    

    if (!formData.latitude || isNaN(formData.latitude)) {
        errors.push("Error in getting location");
    }
    if (!formData.longitude || isNaN(formData.longitude)) {
        errors.push("Error in getting location");
    }

    return errors;
};

export { validateFormData };
