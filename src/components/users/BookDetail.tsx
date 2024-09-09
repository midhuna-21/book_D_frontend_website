import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calculateRoadDistance } from "../../utils/reuseFunction/haversineFormula";
import { toast } from "sonner";
import {
    faUser,
    faBuilding,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userInfo = useSelector((state: any) => state.user.userInfo?.user);
    const userId = userInfo?._id || "";
    const [book, setBook] = useState<any>(null);
    const bookId = book?._id!;
    const rentalFee = book?.rentalFee!;
    const [isRequested, setIsRequested] = useState(false);
    const [totalDays, setTotalDays] = useState<any>(null);
    const [lender, setLender] = useState<any>(null);
    const [requested, setRequested] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const [totalRentalPrice, setTotalRentalPrice] = useState<any>(
        rentalFee * totalDays * quantity
    );

    useEffect(() => {
        setTotalRentalPrice(rentalFee * totalDays * quantity);
    }, [totalDays, quantity, rentalFee]);

    const incrementTotalDays = () => {
        if (totalDays < (book?.maxDays || 1)) {
            setTotalDays(totalDays + 1);
        }
    };

    const decrementTotalDays = () => {
        if (totalDays > (book?.minDays || 1)) {
            setTotalDays(totalDays - 1);
        }
    };

    const incrementQuantity = () => {
        if (quantity < (book?.quantity || 1)) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    useEffect(() => {
        const newSocket = io("http://localhost:8000");
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await userAxiosInstance.get(`/book/${id}`);

                setBook(response.data.book);
                setTotalDays(response.data.book.minDays);
                setLender(response.data.lender);
            } catch (error) {
                console.error("Error fetching book details", error);
            }
        };

        fetchBook();
    }, [id, userId]);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await userAxiosInstance
                    .get(`/check-request/${userId}/${bookId}`)
                    .then((response) => {
                        console.log(response?.data);
                        if (response.status == 200) {
                            const isRequested = response?.data?.isRequested;
                            if (isRequested == true) {
                           
                                setRequested(true);
                            }
                        }
                    })
                    .catch((error: any) => {
                        console.log(
                            "Error fetching notification details",
                            error
                        );
                    });
            } catch (error) {
                console.log("Error fetching notification details", error);
            }
        };
        fetchRequest();
    }, [bookId, userId]);

    const currentUserGetLocation = () => {
        return new Promise<{ latitude: number; longitude: number }>(
            (resolve, reject) => {
                if (navigator.geolocation) {
                    // console.log(navigator.geolocation,'navigatorgolocation')
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                    // console.log(position,'golocation')

                            const { latitude, longitude } =
                                position.coords;
                            resolve({ latitude, longitude });
                        },
                        (error) => {
                            console.error(
                                "Error fetching geolocation:",
                                error
                            );
                            reject("Unable to retrieve location");
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0,
                        }
                    );
                } else {
                    reject(
                        "Geolocation is not supported by your browser"
                    );
                }
            }
        );
    };
    const handleRequest = async () => {
        try {         
            const currentUserLocation = await currentUserGetLocation();
            const bookLocation = {
                latitude: book.latitude,
                longitude: book.longitude,
            };
            const calculateDistance = {
                lat1: currentUserLocation.latitude,
                lng1: currentUserLocation.longitude,
                lat2: bookLocation.latitude,
                lng2: bookLocation.longitude,
            };
            const distanceResponse = await userAxiosInstance.get("/google-distance", {
                params: calculateDistance,
                withCredentials: true,
            })
                if(distanceResponse.status==200){
                    const distance = distanceResponse?.data?.distanceResponse
                    const allowedDistance = book.maxDistance;
                    if (distance > allowedDistance) {
                        toast.error(`The book is available within ${book.maxDistance}.`);
                        return;
                    } else {
                        // const content = "requested to rent this book";
                        // const notificationData = {
                        //     senderId: userId,
                        //     receiverId: lender._id,
                        //     bookId: book._id,
                        //     type: "Request",
                        //     content,
                        // };
        
                        const requestData = {
                            senderId: userId,
                            receiverId: lender._id,
                            bookId: book._id,
                            types: "requested",
                            totalDays,
                            quantity,
                            totalRentalPrice,
                        };
                        const requestResponse = await userAxiosInstance.post(
                            "/request-send",
                            requestData
                        );
                        if (requestResponse.status === 200) {
                            setRequested(true);
                            const requestId = requestResponse?.data?.request?._id; 
                            const content = "Requested to rent this book";
                            const notificationData = {
                              senderId: userId,
                              receiverId: lender._id,
                              bookId: book._id,
                              requestId,
                              type: "Request",
                              content,
                            };
                  
                            const notificationResponse = await userAxiosInstance.post(
                              "/notification",
                              notificationData
                            );
                       if(notificationResponse.status==200){
                        if (socket) {
                            // console.log(socket,'scoekt is here or not')
                            socket.emit("requestBook", notificationResponse?.data?.notification);
                        }
                       }
                        
                       }

                        
                    }
                }else{
                    console.error("Failed to get distance from server:", distanceResponse.statusText);
                }
            
        } catch (error) {
            console.error("Error at Internal server", error);
        }
    };

    // const handleRequest = async () => {
    //     try {

    //         // const currentUserGetLocation = () => {
    //         //     if (navigator.geolocation) {
    //         //         navigator.geolocation.getCurrentPosition(
    //         //             async (position) => {
    //         //                 const { latitude, longitude } = position.coords;
    //         //                 console.log("Coordinates:", latitude, longitude);

    //         //                 const locationDetails = await getAddressFromCoordinates(
    //         //                     latitude,
    //         //                     longitude
    //         //                 );
    //         //                 if (locationDetails) {
    //         //                     setCurrentUserAddress({
    //         //                         ...CurrentUserAddress,
    //         //                         buildingName: locationDetails.buildingName || "",
    //         //                         city: locationDetails.city || "",
    //         //                         district: locationDetails.district || "",
    //         //                         state: locationDetails.state || "",
    //         //                         pincode: locationDetails.pincode || "",
    //         //                     });
    //         //                 }
    //         //             },
    //         //             (error) => {
    //         //                 console.error("Error fetching geolocation:", error);
    //         //                 alert("Unable to retrieve location");
    //         //             }
    //         //         );
    //         //     } else {
    //         //         alert("Geolocation is not supported by your browser");
    //         //     }
    //         // };

    //         // const getAddressFromCoordinates = async (latitude: any, longitude: any) => {
    //         //     const apiKey = "AIzaSyCmH8TJlQEkcdY8ZJzo5pG05UU7-94NFwE";
    //         //     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    //         //     try {
    //         //         const response = await axios.get(url);
    //         //         const results = response.data.results;

    //         //         if (results.length > 0) {
    //         //             const addressComponents = results[0].address_components;
    //         //             console.log("Address Components:", addressComponents);

    //         //             let buildingName = "",
    //         //                 city = "",
    //         //                 district = "",
    //         //                 state = "",
    //         //                 pincode = "";

    //         //             addressComponents.forEach((component: any) => {
    //         //                 if (component.types.includes("premise")) {
    //         //                     buildingName = component.long_name;
    //         //                 }
    //         //                 if (component.types.includes("sublocality")) {
    //         //                     city = component.long_name;
    //         //                 }

    //         //                 if (
    //         //                     component.types.includes("administrative_area_level_3")
    //         //                 ) {
    //         //                     district = component.long_name;
    //         //                 }
    //         //                 if (
    //         //                     component.types.includes("administrative_area_level_1")
    //         //                 ) {
    //         //                     state = component.long_name;
    //         //                 }
    //         //                 if (component.types.includes("postal_code")) {
    //         //                     pincode = component.long_name;
    //         //                 }
    //         //             });

    //         //             return { buildingName, city, district, state, pincode };
    //         //         } else {
    //         //             throw new Error("No results found");
    //         //         }
    //         //     } catch (error: any) {
    //         //         console.error("Error fetching address:", error);
    //         //         return null;
    //         //     }
    //         // };

    //         const content = "requested to rent this book";
    //         const notificationData = {
    //             senderId: userId,
    //             receiverId: lender._id,
    //             bookId: book._id,
    //             type: "Request",
    //             content,
    //         };

    //         const response = await userAxiosInstance.post(
    //             "/notification",
    //             notificationData
    //         );
    //         if (socket) {
    //             socket.emit("requestBook", response?.data?.notification);
    //         }
    //         setRequested(true);
    //     } catch (error) {
    //         console.error("Error at Internal server", error);
    //     }
    // };

    if (!book) return <div>Loading...</div>;

    console.log(book?.images,'book in book detail')
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Request and Get Your Book
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                    Start your reading journey with us and dive into the world
                    of books. Discover new stories, expand your knowledge, and
                    fall in love with reading.
                </p>
            </div>
            <div className="container mx-auto bg-white shadow-md p-4 flex justify-center space-x-16">
                <div className="w-1/4 relative">
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <img
                                src={lender.image}
                                alt={lender.name}
                                className="w-12 h-12 object-cover rounded-full border-2 shadow-md"
                            />
                            <div className="ml-2">
                                <p className="text-xs text-gray-600">
                                    Lended by
                                </p>
                                <span className="text-sm text-gray-800 font-semibold">
                                    {lender.name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Carousel showThumbs={false} className="w-">
                        {book.images.map((image: string, index: number) => (
                            <div key={index} className="w-full   relative">
                                <img
                                    src={image}
                                    alt={`Book ${index}`}
                                    className="w-full h-96 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg">
                    <h1 className="text-3xl font-serif text-gray-800 mb-4">
                        {book.bookTitle}
                    </h1>
                    <p className="text-lg mb-2">
                        <FontAwesomeIcon
                            icon={faUser}
                            className="mr-2 text-gray-600"
                        />
                        <span className="font-semibold text-gray-700">
                            Author :
                        </span>{" "}
                        <span className="data font-mono"> {book.author}</span>
                    </p>
                    <p className="text-lg mb-2">
                        <FontAwesomeIcon
                            icon={faBuilding}
                            className="mr-2 text-gray-600"
                        />
                        <span className="font-semibold text-gray-700">
                            Publisher :
                        </span>{" "}
                        <span className="data font-mono">
                            {" "}
                            {book.publisher}
                        </span>
                    </p>
                    <p className="text-lg mb-2">
                        {/* <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-600" /> */}
                        <span className="font-semibold text-gray-700">
                            Published Year :
                        </span>{" "}
                        <span className="data font-mono">
                            {" "}
                            {book.publishedYear}
                        </span>
                    </p>
                    <p className="text-lg mb-2">
                        <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="text-gray-600"
                        />
                        <span className="font-semibold text-gray-700">
                            Location :
                        </span>
                        <span className="data font-mono">
                            {book?.address?.street}, {book?.address?.city}, {book?.address?.district},{" "}
                            {book?.address?.state}
                        </span>
                    </p>
                    {book.maxDistance !== null && (
                        <p className="text-lg mb-2">
                            {/* <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-600" /> */}
                            <span className="font-semibold text-gray-700">
                                Maximum Distance available:{" "}
                            </span>
                            <span className="data font-mono">
                                {book?.maxDistance} km
                            </span>
                        </p>
                    )}
                    <p className="text-lg mb-2">
                        <span className="font-semibold text-gray-700">
                            Rental Fee / day :
                        </span>
                        <span className="data font-mono">
                            {" "}
                            {book.rentalFee} ₹
                        </span>
                    </p>
                    <p className="text-lg mb-2">
                        <span className="font-semibold text-gray-700">
                            Refundable Deposit :
                        </span>
                        <span className="data font-mono">
                            {" "}
                            {book.extraFee} ₹
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                        This deposit is taken as a security deposit for any
                        potential damages or issues with the book. It is fully
                        refundable upon the safe return of the book without any
                        damages.
                    </p>

                    <p className="text-lg mb-2">
                        <span className="font-semibold text-gray-700">
                            Total Rental Price:
                        </span>
                        <span className="data font-mono"> {totalRentalPrice} ₹</span>
                    </p>

                    <div className="mb-4">
                        <div className="flex flex-row mb-4">
                            <label className="font-semibold text-gray-700 mr-4 whitespace-nowrap">
                                Choose Rental Period (within {book?.minDays} -{" "}
                                {book?.maxDays} days):
                            </label>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={decrementTotalDays}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                                    disabled={
                                        requested ||
                                        totalDays <= (book?.minDays || 1)
                                    }>
                                    -
                                </button>
                                <span className="border border-gray-300 rounded px-3 py-1 bg-white text-center">
                                    {totalDays}
                                </span>
                                <button
                                    onClick={incrementTotalDays}
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                                    disabled={
                                        requested ||
                                        totalDays >= (book?.maxDays || 1)
                                    }>
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <label className="font-semibold text-gray-700 mr-2">
                            Quantity :
                        </label>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={decrementQuantity}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                                disabled={requested || quantity <= 1}>
                                -
                            </button>
                            <span className="border border-gray-300 rounded px-3 py-1 bg-white text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={incrementQuantity}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                                disabled={
                                    requested ||
                                    quantity >= (book?.quantity || 1)
                                }>
                                +
                            </button>
                        </div>
                    </div>

                    <p className="text-lg mb-4 flex flex-col">
                        <span className="font-mono text-gray-500 underline decoration-zinc-400 mb-1">
                            About
                        </span>
                        <span className="data font-mono">
                            {book.description}
                        </span>
                    </p>
                    <button
                        onClick={handleRequest}
                        className={`mt-8 w-1/2 items-center ${
                            requested
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-teal-900 via-zinc-700 to-gray-600"
                        } font-mono text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ${
                            requested
                                ? ""
                                : "hover:from-teal-900 hover:via-zinc-500 hover:to-gray-300"
                        }`}
                        disabled={requested}>
                        {requested ? "Requested" : "Request"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
