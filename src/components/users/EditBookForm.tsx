import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { toast } from "sonner";
import { validateFormData } from "../../utils/validations/bookFormValidatoin";
import { useNavigate, useParams } from "react-router-dom";
import images from "../../assets/images.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

interface Genre {
    genreName: string;
    image: string;
    _id: string;
}
type FormData = {
    bookTitle: string;
    description: string;
    images: File[] | null;
    author: string;
    publisher: string;
    publishedYear: string;
    genre: string;
    customGenre: string;
    rentalFee?: number;
    extraFee?: number;
    price?: number;
    quantity: number;
    address: {
        street: string;
        city: string;
        district: string;
        state: string;
        pincode: string;
    };
    maxDistance: number;
    maxDays: number;
    minDays: number;
    latitude: number;
    longitude: number;
};

const EditBookForm: React.FC = () => {
    const initialFormData: FormData = {
        bookTitle: "",
        description: "",
        images: null,
        author: "",
        publisher: "",
        publishedYear: "",
        genre: "",
        customGenre: "",
        rentalFee: 0,
        extraFee: 0,
        price: 0,
        quantity: 0,
        address: {
            street: "",
            city: "",
            district: "",
            state: "",
            pincode: "",
        },
        maxDistance: 0,
        maxDays: 0,
        minDays: 0,
        latitude: 0,
        longitude: 0,
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const { bookId } = useParams();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    // const [isOtherSelected, setIsOtherSelected] = useState(false);
    // const genres = useSelector(
    //     (state: RootState) => state.admin?.adminInfo?.genres
    // );
    const [genres, setGenres] = useState<Genre[]>([]);
    const [book, setBook] = useState<FormData>();

    const clearInput = () => {
        setFormData(initialFormData);
    };

    const [isRentBook, setIsRentBook] = useState(true);
    const [activeOption, setActiveOption] = useState("addBooks");
    const navigate = useNavigate();

    // const handleChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    // ) => {
    //     const { name, value } = e.target;

    //     if (name === "genre") {
    //         const isOther = value === "Other";
    //         setIsOtherSelected(isOther);
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             genre: isOther ? "Other" : value,
    //             customGenre: isOther ? prevState.customGenre : "",
    //         }));
    //     } else {
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             [name]: ["rentalFee", "price"].includes(name)
    //                 ? parseFloat(value.replace(/^0+/, "")) || 0
    //                 : value,
    //         }));
    //     }
    // };

    const handleRemoveImage = (index: number) => {
        if (formData.images && formData.images.length > 0) {
            const newImages = Array.from(formData.images);
            newImages.splice(index, 1);
            setFormData((prevState) => ({
                ...prevState,
                images: newImages.length > 0 ? newImages : null,
            }));
        }
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await userAxiosInstance.get(`/book/${bookId}`);
                const fetchedBook = response?.data?.book;
                console.log(fetchedBook, "fetched book");
                if (fetchedBook) {
                    setBook(fetchedBook);

                    if (fetchedBook.images) {
                        setImageUrls(fetchedBook.images);
                    }
                }
            } catch (error) {
                console.error("Error fetching book details", error);
            }
        };
        fetchBook();
    }, [bookId]);

    

    useEffect(() => {
        if (book) {
            setFormData({
                bookTitle: book.bookTitle || "",
                description: book.description || "",
                images: Array.isArray(book.images) ? book.images : [],
                author: book.author || "",
                publisher: book.publisher || "",
                publishedYear: book.publishedYear || "",
                genre: book.genre || "",
                customGenre: book.customGenre || "",
                rentalFee: book.rentalFee || 0,
                extraFee: book.extraFee || 0,
                price: book.price || 0,
                quantity: book.quantity || 0,
                address: {
                    street: book.address?.street || "",
                    city: book.address?.city || "",
                    district: book.address?.district || "",
                    state: book.address?.state || "",
                    pincode: book.address?.pincode || "",
                },
                maxDistance: book.maxDistance || 0,
                maxDays: book.maxDays || 0,
                minDays: book.minDays || 0,
                latitude: book.latitude || 0,
                longitude: book.longitude || 0,
            });

            if (book.images && Array.isArray(book.images)) {
                const imageFiles = book.images
                    .map((image) => {
                        if (typeof image === "string") {
                            return { src: image, file: null };
                        } else if (image instanceof File) {
                            const imageUrl = URL.createObjectURL(image);
                            return { src: imageUrl, file: image };
                        }
                        return null;
                    })
                    .filter((item) => item !== null);

            
            }
        }
    }, [book]);

    // console.log(book, "book");
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormData((prevState) => ({
                ...prevState,
                images: prevState.images
                    ? [...Array.from(prevState.images), ...Array.from(files)]
                    : Array.from(files),
            }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        let sanitizedValue = value;
        if (
            [
                "rentalFee",
                "quantity",
                "extraFee",
                "price",
                "maxDistance",
                "maxDays",
                "minDays",
            ].includes(name)
        ) {
            let numericValue = parseFloat(value);
            if (numericValue < 0 || isNaN(numericValue)) {
                numericValue = 0;
            }
            sanitizedValue = numericValue.toString();
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: sanitizedValue,
        }));
    };

    const getLatLngFromAddress = async (address: string) => {
        try {
            const apiKey = "AIzaSyAw-4P7bBpkfYBigSCggZyNEMr4fkP0Z0M";
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json`,
                {
                    params: {
                        address,
                        key: apiKey,
                    },
                }
            );
            if (response.data.status === "OK") {
                const location = response.data.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng,
                };
            } else {
                console.error("Geocoding error:", response.data.status);
                return null;
            }
        } catch (error) {
            console.error("Error while fetching lat/lng:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const response = await userAxiosInstance.get("/genres");
                setGenres(response.data);
            } catch (error) {
                console.error("Error fetching book details", error);
            }
        };

        fetchGenre();
    });

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            // console.log(navigator,'navigator')
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // console.log(navigator.geolocation,'geolocation navigator')
                    const { latitude, longitude } = position.coords;
                    // console.log("Coordinates:", latitude, longitude);

                    const locationDetails = await getAddressFromCoordinates(
                        latitude,
                        longitude
                    );
                    if (locationDetails) {
                        setFormData({
                            ...formData,
                            latitude: latitude,
                            longitude: longitude,
                            address: {
                                street: locationDetails.street || "",
                                city: locationDetails.city || "",
                                district: locationDetails.district || "",
                                state: locationDetails.state || "",
                                pincode: locationDetails.pincode || "",
                            },
                        });
                    }
                },
                (error) => {
                    console.error("Error fetching geolocation:", error);
                    alert("Unable to retrieve location");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    const getAddressFromCoordinates = async (latitude: any, longitude: any) => {
        const key = "AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`;

        try {
            const response = await axios.get(url);

            const results = response.data.results;

            if (results.length > 0) {
                const addressComponents = results[0].address_components;
                let street = "",
                    city = "",
                    district = "",
                    state = "",
                    pincode = "";
                addressComponents.forEach((component: any) => {
                    if (component.types.includes("sublocality_level_2")) {
                        street = component.long_name;
                    }
                    if (component.types.includes("sublocality_level_1")) {
                        city = component.long_name;
                    }

                    if (
                        component.types.includes("administrative_area_level_3")
                    ) {
                        district = component.long_name;
                    }
                    if (
                        component.types.includes("administrative_area_level_1")
                    ) {
                        state = component.long_name;
                    }
                    if (component.types.includes("postal_code")) {
                        pincode = component.long_name;
                    }
                });

                return { street, city, district, state, pincode };
            } else {
                throw new Error("No results found");
            }
        } catch (error: any) {
            console.error("Error fetching address:", error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedAddress = `${formData.address.street}, ${formData.address.city}, ${formData.address.district}, ${formData.address.state}, ${formData.address.pincode}`;

        const latLng = await getLatLngFromAddress(formattedAddress);

        if (latLng) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                latitude: latLng.latitude,
                longitude: latLng.longitude,
            }));
        }

        const errors = validateFormData(formData, isRentBook);
        if (errors.length === 0) {
            const formDataWithImages = new FormData();
            formDataWithImages.append("bookTitle", formData.bookTitle);
            if (formData.images) {
                for (let i = 0; i < formData.images.length; i++) {
                    formDataWithImages.append("images", formData.images[i]);
                }
            }
            formDataWithImages.append("description", formData.description);
            formDataWithImages.append("author", formData.author);
            formDataWithImages.append("publisher", formData.publisher);
            formDataWithImages.append("publishedYear", formData.publishedYear);
            formDataWithImages.append("genre", formData.genre);
            formDataWithImages.append(
                "quantity",
                formData.quantity?.toString() || ""
            );
            formDataWithImages.append("street", formData.address.street || "");
            formDataWithImages.append("city", formData.address.city || "");
            formDataWithImages.append(
                "district",
                formData.address.district || ""
            );
            formDataWithImages.append("state", formData.address.state || "");
            formDataWithImages.append(
                "pincode",
                formData.address.pincode || ""
            );
            formDataWithImages.append(
                "latitude",
                formData.latitude?.toString() || ""
            );
            formDataWithImages.append(
                "longitude",
                formData.longitude?.toString() || ""
            );

            if (isRentBook) {
                formDataWithImages.append(
                    "rentalFee",
                    formData.rentalFee?.toString() || ""
                );
                formDataWithImages.append(
                    "maxDistance",
                    formData.maxDistance?.toString() || ""
                );
                formDataWithImages.append(
                    "maxDays",
                    formData.maxDays?.toString() || ""
                );
                formDataWithImages.append(
                    "minDays",
                    formData.minDays?.toString() || ""
                );

                formDataWithImages.append(
                    "extraFee",
                    formData.extraFee?.toString() || ""
                );
            } else {
                formDataWithImages.append(
                    "price",
                    formData.price?.toString() || ""
                );
            }

            try {
                const response = await userAxiosInstance.put(
                    isRentBook
                        ? `/rent-book-update/${bookId}`
                        : `/sell-book-update/${bookId}`,
                    formDataWithImages,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.status === 200) {
                    toast.success(
                        isRentBook
                            ? "Book updated successfully"
                            : "Book updated successfully"
                    );

                  navigate('/home/profile/my-books')
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, please try again later");
                }
            }
        } else {
            console.error("Form validation errors:", errors);
            toast.error(errors);
        }
    };
    return (
        <div className="flex min-h-screen bg-cover flex-col py-12">
            <h2 className="text-center text-lg md:py-0 py-12 font-bold text-gray-600">
                Update your book details
            </h2>
            <form className="space-y-6 py-12" encType="multipart/form-data">
                <div className="flex flex-col md:flex-row gap-3 px-12">
                    <div className="bg-white opacity-95 shadow-lg rounded-lg px-8 py-6">
                        <div className="flex  mb-6">
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-l-lg ${
                                    isRentBook
                                        ? "bg-gradient-to-r from-sky-900 to-gray-800 text-white"
                                        : "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800"
                                } ${
                                    activeOption === "addBooks"
                                        ? "border border-gray-400"
                                        : ""
                                }`}
                                onClick={() => {
                                    setIsRentBook(true);
                                    setActiveOption("addBooks");
                                }}>
                                Rent Book
                            </button>
                            {/* <button
                        type="button"
                        className={`px-4 py-2 rounded-r-lg ml-0.5 ${
                            !isRentBook
                                ? "bg-gradient-to-r from-sky-900 to-gray-800 text-white"
                                : "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800"
                        } ${
                            activeOption === "addBooks"
                                ? "border border-gray-400"
                                : ""
                        }`}
                        onClick={() => {
                            setIsRentBook(false);
                            setActiveOption("addBooks");
                        }}>
                        Sell Book
                    </button> */}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-6">
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="bookTitle">
                                    Book Title
                                </label>
                                <input
                                    type="text"
                                    id="bookTitle"
                                    name="bookTitle"
                                    // placeholder={book?.bookTitle || "Enter Book Title"}
                                    value={formData.bookTitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />

                                <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="publisher">
                                            Publisher
                                        </label>
                                        <input
                                            type="text"
                                            id="publisher"
                                            name="publisher"
                                            // placeholder={book?.publisher}
                                            value={formData.publisher}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="publishedYear">
                                            Published Year
                                        </label>
                                        <input
                                            type="string"
                                            id="publishedYear"
                                            name="publishedYear"
                                            // placeholder={book?.publishedYear}
                                            value={formData.publishedYear}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="author">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        // placeholder={book?.author}
                                        value={formData.author}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                    />
                                </div>
                                <div className="flex-1 mt-4">
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="state">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        // placeholder={book?.quantity!== undefined ? book.quazntity.toString(): "Enter Quantity"}
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="w-60 h-68 mb-4 relative">
                                    {formData.images &&
                                    formData.images.length > 0 ? (
                                        <Carousel
                                            showThumbs={false}
                                            className="w-full">
                                            {formData.images.map(
                                                (
                                                    image: string | File,
                                                    index: number
                                                ) => {
                                                    let imageUrl;

                                                    if (image instanceof File) {
                                                        imageUrl =
                                                            URL.createObjectURL(
                                                                image
                                                            );
                                                    } else if (
                                                        typeof image ===
                                                        "string"
                                                    ) {
                                                        imageUrl = image;
                                                    }

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="w-full h-full relative">
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Book ${index}`}
                                                                className="w-full h-full object-cover rounded-lg shadow-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-2 left-2 bg-gray-800 text-white rounded-full p-1 m-1 hover:bg-gray-600 transition duration-300"
                                                                onClick={() =>
                                                                    handleRemoveImage(
                                                                        index
                                                                    )
                                                                }>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </Carousel>
                                    ) : (
                                        <img
                                            src={
                                                formData.images
                                                    ? URL.createObjectURL(
                                                          formData.images[0]
                                                      )
                                                    : images
                                            }
                                            alt="Book"
                                            className="w-full h-full object-cover rounded-lg shadow-lg"
                                        />
                                    )}
                                </div>
                                <label
                                    htmlFor="image"
                                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-6 mb-6 mt-4">
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    // placeholder={book?.description}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="genre">
                                    Genre
                                </label>
                                <select
                                    id="genre"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                                    <option value="" disabled>
                                        {book?.genre
                                            ? book.genre.toString()
                                            : "Select a genre"}
                                    </option>
                                    {genres &&
                                        genres.map((genre) => (
                                            <option
                                                key={genre._id}
                                                value={genre.genreName}>
                                                {genre.genreName}
                                            </option>
                                        ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white opacity-95 shadow-lg rounded-lg px-8 py-6 ">
                        <div className="flex flex-col sm:flex-row sm:space-x-6 mt-12 py-2">
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="street">
                                    street
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    // placeholder={book?.street}
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="city">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    // placeholder={book?.city}
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="district">
                                    District
                                </label>
                                <input
                                    type="text"
                                    id="district"
                                    name="district"
                                    // placeholder={book?.district}
                                    value={formData.address.district}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="state">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    // placeholder={book?.state}
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="state">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    // placeholder={book?.pincode}
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-4">
                                Get your current Location
                            </button>
                        </div>

                        {isRentBook ? (
                            <>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="rentalFee">
                                            Rental Fee /day
                                        </label>
                                        <input
                                            type="number"
                                            id="rentalFee"
                                            name="rentalFee"
                                            // placeholder={book?.rentalFee !== undefined ? book.rentalFee.toString() : "Enter rental fee"}
                                            value={formData.rentalFee || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="extraFee">
                                            Extra Fee (for damages/issues)
                                        </label>
                                        <input
                                            type="number"
                                            id="extraFee"
                                            name="extraFee"
                                            // placeholder={book?.extraFee !== undefined ? book.extraFee.toString() : "Enter extraFee fee"}
                                            value={formData.extraFee || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="maxDistance">
                                            Maximum Distance (km)
                                        </label>
                                        <input
                                            type="number"
                                            id="maxDistance"
                                            name="maxDistance"
                                            // placeholder={book?.maxDistance !== undefined ? book.maxDistance.toString() : "Enter maximum distance"}
                                            value={formData.maxDistance || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>{" "}
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="maxDays">
                                            Maximum Days
                                        </label>
                                        <input
                                            type="number"
                                            id="maxDays"
                                            name="maxDays"
                                            // placeholder={book?.maxDistance !== undefined ? book.maxDistance.toString() : "Enter maximum distance fee"}
                                            value={formData.maxDays || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            className="block text-gray-700 font-medium mb-2"
                                            htmlFor="minDays">
                                            Minimum Days
                                        </label>
                                        <input
                                            type="number"
                                            id="minDays"
                                            name="minDays"
                                            // placeholder={book?.minDays !== undefined ? book.minDays.toString() : "Enter minimum days"}
                                            value={formData.minDays || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 mb-6 mt-4">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="price">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    // placeholder={book?.price !== undefined ? book.price.toString() : "Enter price"}
                                    value={formData.price || ""}
                                    onChange={handleChange}
                                    className="w-3/6 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex justify-end mt-12">
                            <button
                                type="button"
                                className="bg-gray-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
                                onClick={() => window.location.reload()}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                // type="submit"
                                className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditBookForm;
