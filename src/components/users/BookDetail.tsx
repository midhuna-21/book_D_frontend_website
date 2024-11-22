import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { FaEdit, FaTrash, FaBookReader } from "react-icons/fa";
import { MdOutlineArchive } from "react-icons/md";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import config from "../../config/config";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../users/Spinner";
import axios from "axios";
import { motion } from "framer-motion";

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userInfo = useSelector((state: any) => state.user.userInfo?.user);
    const address = userInfo?.address;
    const userId = userInfo?._id || "";
    const username = userInfo?.name;
    const [book, setBook] = useState<any>(null);
    const bookId = book?._id!;
    const rentalFee = book?.rentalFee!;
    const extraFee = book?.extraFee!;
    const [totalDays, setTotalDays] = useState<any>(null);
    const [lender, setLender] = useState<any>(null);
    const [requested, setRequested] = useState(false);
    const [isArchived, setIsArchived] = useState<boolean>(
        book?.isArchived || false
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const location = useLocation();
    const myBook = location?.state?.from;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    const [totalDepositAmount, setTotalDepositAmount] = useState<any>(
        extraFee * quantity
    );
    const [totalRentalPrice, setTotalRentalPrice] = useState<any>(
        rentalFee * totalDays * quantity
    );

    const [totalAmount, setTotalAmount] = useState<any>(
        totalDepositAmount + totalRentalPrice
    );

    useEffect(() => {
        setTotalAmount(totalDepositAmount + totalRentalPrice);
    }, [totalDepositAmount, totalRentalPrice]);

    useEffect(() => {
        setTotalRentalPrice(rentalFee * totalDays * quantity);
    }, [totalDays, quantity, rentalFee]);

    useEffect(() => {
        setTotalDepositAmount(extraFee * quantity);
    }, [quantity, extraFee]);

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

    const fetchBook = async () => {
        try {
            setLoading(true);
            const response = await userAxiosInstance.get(
                `/books/details/${id}`
            );
            const bookData = response.data?.book;
            if (bookData && Object.keys(bookData).length > 0) {
                setBook(bookData);
                setTotalDays(bookData.minDays);
                setLender(bookData.lenderId);
                setQuantity(bookData.quantity > 0 ? 1 : 0);
            } else {
                console.log("Book data is empty or unavailable.");
                toast.error("Book details are unavailable.");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "An error occurred while getching book details, please try again later"
                );
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // const fetchRequest = async () => {
        //     try {
        //         await userAxiosInstance
        //             .get(`/books/rent-requests/acceptance/${userId}/${bookId}`)
        //             .then((response) => {
        //                 if (response.status == 200) {
        //                     console.log(response.data,'response')
        //                     const isAccepted = response?.data?.isAccepted;

        //                     if (isAccepted.types == "requested") {
        //                         setRequested(true);
        //                     }
        //                 }
        //             })
        //             .catch((error: any) => {
        //                 console.log(
        //                     "Error fetching notification details",
        //                     error
        //                 );
        //             });
        //     } catch (error:any) {
        //         if (error.response && error.response.status === 403) {
        //             toast.error(error.response.data.message);
        //         } else {
        //             toast.error("An error occurred, please try again later");
        //         }
        //     }
        // };
        // fetchRequest();
        fetchBook();
    }, [id, userId, bookId]);

    const currentUserGetLocation = () => {
        return new Promise<{ latitude: number; longitude: number }>(
            (resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            resolve({ latitude, longitude });
                        },
                        (error) => {
                            console.error("Error fetching geolocation:", error);
                            reject("Unable to retrieve location");
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0,
                        }
                    );
                } else {
                    reject("Geolocation is not supported by your browser");
                }
            }
        );
    };

    useEffect(() => {
        const newSocket = io(config.API_BACKEND);
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);
    const handleRequest = async () => {
        try {
            const userAddress = userInfo?.address;
            if (!userAddress) {
                Swal.fire({
                    icon: "warning",
                    title: "Address Required",
                    text: "Before you request a book, you must add your address.",
                    showCancelButton: false,
                    confirmButtonText: "Go to Profile",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/profile");
                    }
                });
                return;
            }
            // const lenderAddress = book?.address;

            // const origin = `${userAddress.street}, ${userAddress.city}, ${userAddress.state}, ${userAddress.pincode}`;
            // const destination = `${lenderAddress.street}, ${lenderAddress.city}, ${lenderAddress.state}, ${lenderAddress.pincode}`;

            // const API_KEY = "AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q";
            // const distanceResponse = await axios.get(
            //     `https://maps.googleapis.com/maps/api/distancematrix/json`,
            //     {
            //         params: {
            //             origins: origin,
            //             destinations: destination,
            //             key: API_KEY,
            //         },
            //     }
            // );
            // if (distanceResponse?.data?.status === "OK") {
            //     const distance =
            //         distanceResponse.data.rows[0].elements[0].distance.value;
            //     const maxDistance = book.maxDistance * 1000;

            //     console.log(
            //         `Distance: ${distance} meters, Max Distance: ${maxDistance} meters`
            //     );

            //     if (distance > maxDistance) {
            //         toast.error(
            //             `The book is not available for distances greater than ${book.maxDistance} km.`
            //         );
            //         return;
            //     }

            const cartData = {
                userId,
                ownerId: lender._id,
                bookId: book._id,
                quantity,
                totalAmount,
                totalRentalPrice,
                totalDepositAmount,
                totalDays,
                types: "requested",
            };
            const cartCreateResponse = await userAxiosInstance.post(
                "/cart/add",
                cartData
            );

            const cartId = cartCreateResponse?.data?.cart?._id;
            if (cartCreateResponse.status == 200) {
                const notificationData = {
                    cartId,
                    userId,
                    receiverId: lender._id,
                    bookId: book._id,
                    status: "requested",
                };
                const notificationResponse = await userAxiosInstance.post(
                    "/notifications/send-notification",
                    notificationData
                );
                if (notificationResponse.status === 200) {
                    if (socket) {
                        socket.emit("send-notification", {
                            receiverId: lender._id,
                            notification:
                                notificationResponse?.data?.notification,
                        });
                    }
                    Swal.fire({
                        icon: "success",
                        title: "Request Sent",
                        text: "Your request has been sent to the lender. Please wait for acceptance.",
                        confirmButtonText: "OK",
                    });
                } else {
                    console.error(
                        "Failed to send notification:",
                        notificationResponse.statusText
                    );
                }
            } else {
                console.error(
                    "Failed to create cart item :",
                    cartCreateResponse.statusText
                );
            }
            // } else {
            //     console.error(
            //         "Failed to get distance:",
            //         distanceResponse?.data?.error_message
            //     );
            //     toast.error("Unable to fetch distance. Please try again.");
            //     return;
            // }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
            }
        }
    };
    // const handleRequest = async () => {
    //     try {
    //         const currentUserLocation = await currentUserGetLocation();
    //         const bookLocation = {
    //             latitude: book.latitude,
    //             longitude: book.longitude,
    //         };

    //         const calculateDistance = {
    //             lat1: currentUserLocation.latitude,
    //             lng1: currentUserLocation.longitude,
    //             lat2: bookLocation.latitude,
    //             lng2: bookLocation.longitude,
    //         };

    //         const distanceResponse = await userAxiosInstance.get(
    //             "/google/locations/distance",
    //             {
    //                 params: calculateDistance,
    //                 withCredentials: true,
    //             }
    //         );

    //         if (distanceResponse.status === 200) {
    //             const distance = distanceResponse?.data?.distanceResponse;
    //             const allowedDistance = book.maxDistance;

    //             if (distance > allowedDistance) {
    //                 toast.error(
    //                     `The book is available within ${book.maxDistance}.`
    //                 );
    //                 return;
    //             } else {
    //                 const cartData = {
    //                     userId,
    //                     ownerId: lender._id,
    //                     bookId: book._id,
    //                     quantity,
    //                     totalAmount,
    //                     totalRentalPrice,
    //                     totalDepositAmount,
    //                     totalDays,
    //                     types: "requested",
    //                 };
    //                 const cartCreateResponse = await userAxiosInstance.post(
    //                     "/cart/add",
    //                     cartData
    //                 );

    //                 const cartId = cartCreateResponse?.data?.cart?._id;
    //                 if (cartCreateResponse.status == 200) {
    //                     const notificationData = {
    //                         cartId,
    //                         userId,
    //                         receiverId: lender._id,
    //                         bookId: book._id,
    //                         status: "requested",
    //                     };
    //                     const notificationResponse =
    //                         await userAxiosInstance.post(
    //                             "/notifications/send-notification",
    //                             notificationData
    //                         );
    //                     if (notificationResponse.status === 200) {
    //                         if (socket) {
    //                             socket.emit("send-notification", {
    //                                 receiverId: lender._id,
    //                                 notification:
    //                                     notificationResponse?.data
    //                                         ?.notification,
    //                             });
    //                         }
    //                         Swal.fire({
    //                             icon: "success",
    //                             title: "Request Sent",
    //                             text: "Your request has been sent to the lender. Please wait for acceptance.",
    //                             confirmButtonText: "OK",
    //                         });
    //                     } else {
    //                         console.error(
    //                             "Failed to send notification:",
    //                             notificationResponse.statusText
    //                         );
    //                     }
    //                 } else {
    //                     console.error(
    //                         "Failed to create cart item :",
    //                         cartCreateResponse.statusText
    //                     );
    //                 }
    //             }
    //         } else {
    //             console.error(
    //                 "Failed to get distance from server:",
    //                 distanceResponse.statusText
    //             );
    //         }
    //     } catch (error: any) {
    //         if (error.response && error.response.status === 403) {
    //             toast.error(error.response.data.message);
    //         } else {
    //             toast.error("An error occurred, please try again later");
    //         }
    //     }
    // };

    const toggleArchiveStatus = async (bookId: string, isArchived: boolean) => {
        try {
            const endpoint = isArchived ? "/books/unarchive" : "/books/archive";
            const response = await userAxiosInstance.post(endpoint, { bookId });
            const bookData = response.data?.book;

            if (bookData && Object.keys(bookData).length > 0) {
                setBook(bookData);
                setTotalDays(bookData.minDays);
                setLender(bookData.lenderId);
                setQuantity(bookData.quantity);
                toast.success(
                    bookData.isArchived
                        ? "Book archived successfully!"
                        : "Book restored successfully!"
                );
            } else {
                console.log("Book data is empty or unavailable.");
                toast.error("Book details are unavailable.");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, try again later");
            }
        }
    };

    const handlePermanentDelete = async (bookId: string) => {
        try {
            const response = await userAxiosInstance.delete(
                `/books/remove/${bookId}`
            );
            console.log(response.data);
            if (response.status == 200) {
                navigate("/profile/lend-books");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, try again later");
            }
        }
    };

    const navigate = useNavigate();
    const handleEditClick = async (bookId: string) => {
        navigate(`/books/update/${bookId}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    className="loader w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <p className="mt-4 text-gray-600 text-md font-semibold">
                    Loading notifications...
                </p>
            </div>
        );
    }
    if (!book)
        return (
            <div>
                <Spinner />
            </div>
        );

    return (
        <div className="flex flex-col items-center justify-center py-24 min-h-screen">
            <div className="mb-6 text-center ">
                <h1 className="text-23xl font-bold text-gray-800 sm:text-2xl">
                    {myBook ? "Yours Books Store" : "Request and Get Your Book"}
                </h1>
                <p className="text-sm text-gray-600 mt-2 sm:text-base p-2">
                    {myBook
                        ? "Manage your books "
                        : " Start your reading journey with us and dive into the world of books."}
                </p>
                <div className="flex justify-center items-center mt-4">
                    <div className="flex items-center w-3/4 sm:w-1/2">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <FaBookReader className="mx-3 rounded-full text-gray-800 text-xxl" />
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                </div>
            </div>
            <div className="w-full p-2 flex flex-col md:flex-row justify-center space-y-1 md:space-y-0 md:space-x-5">
                <div
                    className={`relative rounded-2xl p-5 ${
                        myBook ? "shadow-lg" : ""
                    }`}>
                    <div className="flex items-center  border-gray-500 rounded-full">
                        <img
                            src={lender.image}
                            alt={lender.name}
                            className="w-12 h-12 object-cover rounded-full border-2 shadow-md"
                        />
                        <div className="ml-2">
                            <p className="text-xs text-gray-600">Lended by</p>
                            <span className="text-sm text-gray-800 font-semibold ">
                                {lender.name}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="border-gray-300 border-2">
                            <Carousel showThumbs={false} className="w-80">
                                {book.images.map(
                                    (image: string, index: number) => (
                                        <div
                                            key={index}
                                            className="w-80 h-96 flex justify-center items-center">
                                            <img
                                                src={image}
                                                alt={`Book ${index}`}
                                                className="w-72 h-96 object-fit shadow-md"
                                            />
                                        </div>
                                    )
                                )}
                            </Carousel>
                        </div>
                        {myBook ? (
                            <>
                                <div className="mt-10 w-2/3">
                                    <h2 className="text-lg font-bold mb-4 text-gray-700 p-3 relative">
                                        Manage Book
                                        <span className="absolute bottom-0 left-3 w-[90%] h-[2px] bg-zinc-500"></span>
                                    </h2>
                                    <div
                                        onClick={() =>
                                            handleEditClick(book._id)
                                        }
                                        className="flex items-center justify-between py-3 px-4 border-b cursor-pointer hover:bg-gray-300">
                                        <p className="text-gray-700">Edit</p>
                                        <FaEdit className="text-blue-600 text-lg cursor-pointer hover:text-blue-500 transition duration-150" />
                                    </div>
                                    <div
                                        onClick={() =>
                                            !isLoading &&
                                            toggleArchiveStatus(
                                                book._id,
                                                book.isArchived
                                            )
                                        }
                                        className={`flex items-center justify-between py-3 px-4 border-b cursor-pointer 
        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}>
                                        <p className="text-gray-700">
                                            {book.isArchived
                                                ? "Restore"
                                                : "Archive"}
                                        </p>
                                        <MdOutlineArchive
                                            className={`text-2xl transition duration-150 ${
                                                book.isArchived
                                                    ? "text-green-600 hover:text-green-500"
                                                    : "text-gray-600 hover:text-gray-500"
                                            } ${
                                                isLoading ? "animate-spin" : ""
                                            }`}
                                        />
                                    </div>

                                    {/* <div
                                        onClick={() =>
                                            handlePermanentDelete(book._id)
                                        }
                                        className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-300">
                                        <p className="text-gray-700">
                                            Permanently delete
                                        </p>
                                        <FaTrash className="text-red-600 text-lg cursor-pointer hover:text-red-500 transition duration-150" />
                                    </div> */}
                                </div>
                            </>
                        ) : (
                            <div className="items-center justify-center flex flex-col">
                                <button
                                    onClick={handleRequest}
                                    className={`mt-8  md:w-full  ${
                                        book.quantity === 0 || requested
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-teal-900 via-zinc-700 to-gray-600"
                                    } font-mono text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ${
                                        book.quantity === 0 || requested
                                            ? ""
                                            : "hover:from-teal-900 hover:via-zinc-500 hover:to-gray-300"
                                    }`}
                                    disabled={book.quantity === 0 || requested}>
                                    {requested ? "Requested" : "Request"}
                                </button>
                                {book.quantity === 0 && (
                                    <p className="mt-2 text-red-500 text-sm">
                                        The book is not available now.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="md:w-1/2 w-full mx-auto p-6 bg- rounded-lg space-y-5">
                    <h1 className="text-lg md:text-xl font-bold mb-4 ">
                        {book.bookTitle}
                    </h1>

                    <p className="mb-5">
                        <span
                            className={`${
                                isExpanded ? "" : "line-clamp-2"
                            } transition-all duration-300 ease-in-out text-gray-600`}>
                            {book.description}
                        </span>
                        {book.description.length > 100 && (
                            <button
                                onClick={toggleReadMore}
                                className="text-blue-600 cursor-pointer hover:underline px-2">
                                {isExpanded ? "Read less" : "Read more"}
                            </button>
                        )}
                    </p>
                    <p className=" mb-2 flex items-center">
                        <span className="font-semibold w-40 text-sm">
                            GENRE
                        </span>{" "}
                        <span>{book.genre}</span>
                    </p>
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold w-40 text-sm">
                            AUTHOR
                        </span>{" "}
                        <span> {book.author}</span>
                    </p>
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold text-sm w-40">
                            PUBLISHER
                        </span>{" "}
                        <span className="md:ml-0 ml-4"> {book.publisher}</span>
                    </p>
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold w-40 text-sm">
                            PUBLISHED YEAR
                        </span>{" "}
                        <span> {book.publishedYear}</span>
                    </p>
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold text-sm w-60 md:w-40">
                            LOCATION
                        </span>
                        <span>
                            {book?.address?.street}, {book?.address?.city},{" "}
                            {book?.address?.district}, {book?.address?.state}
                        </span>
                    </p>
                    {book.maxDistance !== null && (
                        <p className="mb-2 flex items-center">
                            <span className="font-semibold text-sm w-40">
                                MAXIMUM DISTANCE AVAILABLE{" "}
                            </span>
                            <span>{book?.maxDistance} km</span>
                        </p>
                    )}
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold text-sm w-40">
                            RENTAL PRICE PER DAY
                        </span>
                        <span> {book.rentalFee} ₹</span>
                    </p>
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold text-sm w-40">
                            REFUNDABLE DEPOSIT
                        </span>
                        <span> {totalDepositAmount} ₹</span>
                    </p>
                    <p className="mb-4">
                        This deposit is taken as a security deposit for any
                        potential damages or issues with the book. It is fully
                        refundable upon the safe return of the book without any
                        damages.
                    </p>
                    <p className="mb-2 flex items-center">
                        <span className="font-semibold text-sm w-40">
                            TOTAL RENTAL PRICE
                        </span>
                        <span> {totalRentalPrice} ₹</span>
                    </p>
                    <div className="mb-4 flex items-center">
                        {myBook ? (
                            <label className="font-semibold  mr-4 white space-normal text-sm sm:text-sm w-40">
                                RENTAL PERIOD {book?.maxDays} DAYS
                            </label>
                        ) : (
                            <div className="flex flex-col md:flex-row mb-4 ">
                                <label className="font-semibold mr-4 whitespace-normal text-sm sm:text-sm">
                                    CHOOSE (WITHIN {book?.minDays} -{" "}
                                    {book?.maxDays} days)
                                </label>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={decrementTotalDays}
                                        className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 ${
                                            requested || quantity == 0
                                                ? "cursor-not-allowed"
                                                : ""
                                        }`}
                                        disabled={
                                            requested ||
                                            totalDays <= (book?.minDays || 1) ||
                                            quantity == 0
                                        }>
                                        -
                                    </button>
                                    <span className="border border-gray-300 rounded px-3 py-1 bg-white text-center">
                                        {totalDays}
                                    </span>
                                    <button
                                        onClick={incrementTotalDays}
                                        className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 ${
                                            requested || quantity === 0
                                                ? "cursor-not-allowed"
                                                : ""
                                        }`}
                                        disabled={
                                            requested ||
                                            totalDays >= (book?.maxDays || 1) ||
                                            quantity == 0
                                        }>
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row">
                        <label className="font-semibold text-sm mr-2  md:w-40">
                            QUANTITY
                        </label>
                        {myBook ? (
                            <span>{book?.quantity}</span>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={decrementQuantity}
                                    className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 ${
                                        requested || quantity === 0
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={requested || quantity == 0}>
                                    -
                                </button>
                                <span className="border border-gray-300 rounded px-3 py-1 bg-white text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 ${
                                        requested || quantity === 0
                                            ? "cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={requested || quantity == 0}>
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
