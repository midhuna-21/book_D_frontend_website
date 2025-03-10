import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { toast } from "sonner";
import { validateFormData } from "../../utils/validations/bookFormValidatoin";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from "../../assets/images.png";

interface Genre {
    genreName: string;
    image: string;
    _id: string;
}

const LendBookForm: React.FC = () => {

    const [bookTitle, setBookTitle] = useState<string>("");
    const [publisher, setPublisher] = useState<string>("");
    const [publishedYear, setPublishedYear] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [rentalFee, setRentalFee] = useState<number>(0);
    const [extraFee, setExtraFee] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [maxDistance, setMaxDistance] = useState<number>(0);
    const [maxDays, setMaxDays] = useState<number>(0);
    const [minDays, setMinDays] = useState<number>(0);

    const [address, setAddress] = useState({
        street: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
    });

  
    // const [formData, setFormData] = useState<FormData>(initialFormData);

    const [genres, setGenres] = useState<Genre[]>([]);

    const navigate = useNavigate();

    // const clearInput = () => {
    //     setFormData(initialFormData);
    // };

    // const handleRemoveImage = (index: number) => {
    //     if (formData.images && formData.images.length > 0) {
    //         const newImages = Array.from(formData.images);
    //         newImages.splice(index, 1);
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             images: newImages.length > 0 ? newImages : null,
    //         }));
    //     }
    // };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setImages((prevState) => [...prevState, ...Array.from(files)]);
        }
    };
    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (files) {
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             images: prevState.images
    //                 ? [...Array.from(prevState.images), ...Array.from(files)]
    //                 : Array.from(files),
    //         }));
    //     }
    // };

    // const handleChange = (
    //     e: React.ChangeEvent<
    //         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    //     >
    // ) => {
    //     const { name, value } = e.target;
    //     if (name.startsWith("address")) {
    //         const fieldName = name.split(".")[1];
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             address: {
    //                 ...prevState.address,
    //                 [fieldName]: value,
    //             },
    //         }));
    //     } else {
    //         let sanitizedValue = value;
    //         if (
    //             [
    //                 "rentalFee",
    //                 "quantity",
    //                 "extraFee",
    //                 "maxDistance",
    //                 "maxDays",
    //                 "minDays",
    //             ].includes(name)
    //         ) {
    //             let numericValue = parseFloat(value);
    //             if (numericValue < 0 || isNaN(numericValue)) {
    //                 numericValue = 0;
    //             }
    //             sanitizedValue = numericValue.toString();
    //         }
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             [name]: sanitizedValue,
    //         }));
    //     }
    // };

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
        const fetchBook = async () => {
            try {
                const response = await userAxiosInstance.get("/genres");
                setGenres(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "An error occurred while fetching genres, try again later"
                    );
                }
            }
        };

        fetchBook();
    }, []);

    // const handleGetLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             async (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 const locationDetails = await getAddressFromCoordinates(
    //                     latitude,
    //                     longitude
    //                 );
    //                 if (locationDetails) {
    //                     setFormData({
    //                         ...formData,
    //                         latitude: latitude,
    //                         longitude: longitude,
    //                         address: {
    //                             street: locationDetails.street || "",
    //                             city: locationDetails.city || "",
    //                             district: locationDetails.district || "",
    //                             state: locationDetails.state || "",
    //                             pincode: locationDetails.pincode || "",
    //                         },
    //                     });
    //                 }
    //             },
    //             (error) => {
    //                 console.error("Error fetching geolocation:", error);
    //                 alert("Unable to retrieve location");
    //             },
    //             {
    //                 enableHighAccuracy: true,
    //                 timeout: 10000,
    //                 maximumAge: 0,
    //             }
    //         );
    //     } else {
    //         alert("Geolocation is not supported by your browser");
    //     }
    // };

    // const getAddressFromCoordinates = async (latitude: any, longitude: any) => {
    //     const key = "AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q";
    //     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`;

    //     try {
    //         const response = await axios.get(url);
    //         const results = response.data.results;

    //         if (results.length > 0) {
    //             const addressComponents = results[0].address_components;
    //             let street = "",
    //                 city = "",
    //                 district = "",
    //                 state = "",
    //                 pincode = "";

    //             addressComponents.forEach((component: any) => {
    //                 if (component.types.includes("sublocality_level_2")) {
    //                     street = component.long_name;
    //                 }
    //                 if (component.types.includes("sublocality_level_1")) {
    //                     city = component.long_name;
    //                 }

    //                 if (
    //                     component.types.includes("administrative_area_level_3")
    //                 ) {
    //                     district = component.long_name;
    //                 }
    //                 if (
    //                     component.types.includes("administrative_area_level_1")
    //                 ) {
    //                     state = component.long_name;
    //                 }
    //                 if (component.types.includes("postal_code")) {
    //                     pincode = component.long_name;
    //                 }
    //             });

    //             return { street, city, district, state, pincode };
    //         } else {
    //             throw new Error("No results found");
    //         }
    //     } catch (error: any) {
    //         console.error("Error fetching address:", error);
    //         return null;
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedAddress = `${address.street}, ${address.city}, ${address.district}, ${address.state}, ${address.pincode}`;

        // const latLng = await getLatLngFromAddress(formattedAddress);

        // if (latLng) {
        //     setLatitude(latLng.latitude);
        //     setLongitude(latLng.longitude);
        // }
        const addr = {
            street: address.state,
            city: address.city,
            district: address.district,
            state: address.state,
            pincode: address.pincode,
        };
        // const errors = validateFormData({
        //     bookTitle,
        //     publisher,
        //     publishedYear,
        //     author,
        //     description,
        //     genre,
        //     images,
        //     address: addr,
        //     rentalFee,
        //     extraFee,
        //     quantity,
        //     maxDistance,
        //     maxDays,
        //     minDays,
        // });
        // if (errors.length === 0) {
            const formDataWithImages = new FormData();
            formDataWithImages.append("bookTitle", bookTitle);
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    formDataWithImages.append("images", images[i]);
                }
            }
            formDataWithImages.append("description", description);
            formDataWithImages.append("author", author);
            formDataWithImages.append("publisher", publisher);
            formDataWithImages.append("publishedYear", publishedYear);
            formDataWithImages.append("genre", genre);
            formDataWithImages.append("quantity", quantity?.toString() || "");
            formDataWithImages.append("street", address.street || "");
            formDataWithImages.append("city", address.city || "");
            formDataWithImages.append("district", address.district || "");
            formDataWithImages.append("state", address.state || "");
            formDataWithImages.append("pincode", address.pincode || "");
            // formDataWithImages.append(
            //     "latitude",
            //     latitude?.toString() || ""
            // );
            // formDataWithImages.append(
            //     "longitude",
            //      longitude?.toString() || ""
            // );

            formDataWithImages.append("rentalFee", rentalFee?.toString() || "");
            formDataWithImages.append(
                "maxDistance",
                maxDistance?.toString() || ""
            );
            formDataWithImages.append("maxDays", maxDays?.toString() || "");
            formDataWithImages.append("minDays", minDays?.toString() || "");

            formDataWithImages.append("extraFee", extraFee?.toString() || "");

            try {
                const response = await userAxiosInstance.post(
                    "/books/lend-book",
                    formDataWithImages,
                    {
                        withCredentials: true,
                        headers: {                                                                                                                                      
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.status === 200) {
                    navigate("/profile/lend-books");
                }
            } catch (error: any) {
                if (
                    (error.response && error.response.status === 404) ||
                    error.response.status === 403
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, please try again later");
                }
            }
        // } else {
        //     console.error("Form validation errors:", errors);
        //     toast.error(errors);
        // }
    };

    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-12 text-center">
                <h1 className="text-23xl font-bold text-gray-800 sm:text-2xl">
                    Lend Out Your Books
                </h1>
                <p className="text-sm text-gray-600 mt-2 sm:text-base md:p-1 p-3">
                    Share your favorite reads and let others enjoy them while
                    earning along the way.
                </p>
            </div>
            <form className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3 px-12">
                    <div className="bg-white opacity-95 shadow-lg rounded-lg px-8 py-6 border-gray-200 border">
                   
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
                                    placeholder="e.g., Wings Of Fire"
                                    value={bookTitle}
                                    onChange={(e) =>
                                        setBookTitle(e.target.value)
                                    }
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
                                            placeholder="e.g., Universities Press"
                                            value={publisher}
                                            onChange={(e) =>
                                                setPublisher(e.target.value)
                                            }
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
                                            placeholder="e.g., 2003"
                                            value={publishedYear}
                                            onChange={(e) =>
                                                setPublishedYear(e.target.value)
                                            }
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
                                        placeholder="e.g., A.P.J Abdul Kalam"
                                        value={author}
                                        onChange={(e) =>
                                            setAuthor(e.target.value)
                                        }
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
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center ">
                                <div className="w-60 h-68 mb-4 relative">
                                    {images.length > 0 ? (
                                        <Carousel
                                            showThumbs={false}
                                            className="w-full">
                                            {images.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="w-full h-full relative">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            image
                                                        )}
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
                                            ))}
                                        </Carousel>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                        <img
                                            src={image}
                                            alt="Book"
                                            className="w-full h-full object-cover rounded-lg shadow-lg"
                                        />
                                    </div>
                                    
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
                        <div className="flex flex-col sm:flex-row sm:space-x-6 mb-6 mt-4 ">
                            <div className="flex-1">
                                <label
                                    className="block text-gray-700 font-medium mb-2"
                                    htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="e.g., Wings of Fire (1999), is the autobiography of the Missile Man..."
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
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                                    <option value="" disabled>
                                        Select a genre
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
                    <div className="bg-white opacity-95 shadow-lg rounded-lg px-8 py-6 border-gray-200 border">
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
                                    name="address.street"
                                    value={address.street}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            street: e.target.value,
                                        }))
                                    }
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
                                    name="address.city"
                                    value={address.city}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }))
                                    }
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
                                    name="address.district"
                                    value={address.district}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            district: e.target.value,
                                        }))
                                    }
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
                                    name="address.state"
                                    value={address.state}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }))
                                    }
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
                                    name="address.pincode"
                                    value={address.pincode}
                                    onChange={(e) =>
                                        setAddress((prev) => ({
                                            ...prev,
                                            pincode: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                        </div>

                        {/* <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
                            <button
                                type="button"
                                // onClick={handleGetLocation}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-4">
                                Get your current Location
                            </button>
                        </div> */}

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
                                    placeholder="e.g., 20 rs"
                                    value={rentalFee}
                                    onChange={(e) =>
                                        setRentalFee(parseFloat(e.target.value))
                                    }
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
                                    value={extraFee}
                                    onChange={(e) =>
                                        setExtraFee(parseFloat(e.target.value))
                                    }
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
                                    placeholder="e.g., 50 km"
                                    value={maxDistance}
                                    onChange={(e) =>
                                        setMaxDistance(
                                            parseFloat(e.target.value)
                                        )
                                    }
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
                                    placeholder="e.g., 30 days"
                                    value={maxDays || ""}
                                    onChange={(e) =>
                                        setMaxDays(parseFloat(e.target.value))
                                    }
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
                                    placeholder="e.g., 30 days"
                                    value={minDays || ""}
                                    onChange={(e) =>
                                        setMinDays(parseFloat(e.target.value))
                                    }
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-sm"
                                />
                            </div>
                        </div>

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

export default LendBookForm;
