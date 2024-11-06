import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { FaBookOpen } from "react-icons/fa";
import {
    faUser,
    faBuilding,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import config from "../../config/config";
import { useLocation, useNavigate } from "react-router-dom";

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userInfo = useSelector((state: any) => state.user.userInfo?.user);
    const userId = userInfo?._id || "";
    const [book, setBook] = useState<any>(null);
    const bookId = book?._id!;
    const rentalFee = book?.rentalFee!;
    const extraFee = book?.extraFee!;
    const [totalDays, setTotalDays] = useState<any>(null);
    const [lender, setLender] = useState<any>(null);
    const [requested, setRequested] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
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
            const response = await userAxiosInstance.get(
                `/books/details/${id}`
            );
            const bookData = response.data?.book;
            if (bookData && Object.keys(bookData).length > 0) {
                setBook(bookData);
                setTotalDays(bookData.minDays);
                setLender(response.data.lender);
                setQuantity(bookData.quantity);
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

            const distanceResponse = await userAxiosInstance.get(
                "/google/locations/distance",
                {
                    params: calculateDistance,
                    withCredentials: true,
                }
            );

            if (distanceResponse.status === 200) {
                const distance = distanceResponse?.data?.distanceResponse;
                const allowedDistance = book.maxDistance;

                if (distance > allowedDistance) {
                    toast.error(
                        `The book is available within ${book.maxDistance}.`
                    );
                    return;
                } else {
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
                        const notificationResponse =
                            await userAxiosInstance.post(
                                "/notifications/send-notification",
                                notificationData
                            );
                        if (notificationResponse.status === 200) {
                            if (socket) {
                                socket.emit("send-notification", {
                                    receiverId: lender._id,
                                    notification:
                                        notificationResponse?.data
                                            ?.notification,
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
                }
            } else {
                console.error(
                    "Failed to get distance from server:",
                    distanceResponse.statusText
                );
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
            }
        }
    };

    const handleArchive = async (bookId: string) => {
        try {
            console.log(bookId, "book");
            // const response = await userAxiosInstance.post("/books/archive", {
            //      bookId,
            // });
            // console.log(response,'response')
            // const book = response.data;
            // setBooks((prevBooks) =>
            //     prevBooks.map((book) =>
            //         book._id === bookId ? { ...book, isArchived: true } : book
            //     )
            // );
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, try again later");
            }
        }
    };

    const handleUnArchive = async (bookId: string) => {
        try {
            // const response = await userAxiosInstance.post("/books/unarchive", {
            //     bookId,
            // });
            // console.log(response,'reposnse')
            // const book = response.data;
            // setBooks((prevBooks) =>
            //     prevBooks.map((book) =>
            //         book._id === bookId ? { ...book, isArchived: false } : book
            //     )
            // );
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

    if (!book) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center py-12 min-h-screen">
            <div className="mb-12 text-center">
                <h1 className="text-23xl font-bold text-gray-800 sm:text-2xl">
                    {myBook ? "Yours Books Store" : "Request and Get Your Book"}
                </h1>
                <p className="text-sm text-gray-600 mt-2 sm:text-base">
                    {myBook
                        ? "Manage your books "
                        : " Start your reading journey with us and dive into the world of books."}
                </p>
            </div>
            {/* <div className="w-full px-4 sm:px-6 md:px-8"> */}
            <div className="bg-white shadow-md p-4 flex flex-col md:flex-row justify-center  space-y-4 md:space-y-0 md:space-x-16">
                <div className="w-full md:w-1/3 relative">
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
                                <span className="text-sm text-gray-800 font-semibold ">
                                    {lender.name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <Carousel showThumbs={false} className="w-80">
                            {book.images.map((image: string, index: number) => (
                                <div
                                    key={index}
                                    className="w-80 h-96 flex justify-center items-center">
                                    <img
                                        src={image}
                                        alt={`Book ${index}`}
                                        className="w-72 h-96 object-fit shadow-md"
                                    />
                                </div>
                            ))}
                        </Carousel>
                        {myBook ? (
                            <div className="flex flex-row gap-4 items-center mt-8">
                                <button
                                    onClick={() => handleEditClick(book._id)}
                                    className="bg-gradient-to-r from-teal-900 via-zinc-700 to-gray-600 text-white font-mono px-6 py-3 rounded-lg shadow-lg transition duration-300 hover:from-teal-800 hover:via-zinc-600 hover:to-gray-500 focus:ring-2 focus:ring-teal-700 focus:outline-none">
                                    Edit
                                </button>

                                {/* <button
                                    className={`${
                                        book.isArchived
                                            ? "bg-green-600 hover:bg-green-500 focus:ring-2 focus:ring-green-400"
                                            : "bg-gray-600 hover:bg-gray-500 focus:ring-2 focus:ring-gray-400"
                                    } text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 focus:outline-none`}
                                    style={{
                                        width: "100px",
                                    }}
                                    onClick={() =>
                                        book.isArchived
                                            ? handleUnArchive(book._id)
                                            : handleArchive(book._id)
                                    }>
                                    {book.isArchived ? "Unarchive" : "Archive"}
                                </button> */}
                            </div>
                        ) : (
                            <div className="items-center justify-center flex flex-col">
                                <button
                                    onClick={handleRequest}
                                    className={`mt-8 w-2/3 md:w-full  ${
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
                <div className="w-full md:w-2/3 max-w-md mx-auto p-6 bg-white rounded-lg">
                    <h1 className="text-2xl md:text-3xl font-serif text-gray-800 mb-4">
                        {book.bookTitle}
                    </h1>
                    <p className="text-lg mb-2 flex items-center">
                        <FaBookOpen className="mr-2 text-gray-600" />
                        <span className="font-semibold text-gray-700">
                            Genre :
                        </span>{" "}
                        <span className="data font-mono">{book.genre}</span>
                    </p>

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
                            {book?.address?.street}, {book?.address?.city},{" "}
                            {book?.address?.district}, {book?.address?.state}
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
                            {totalDepositAmount} ₹
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
                        <span className="data font-mono">
                            {" "}
                            {totalRentalPrice} ₹
                        </span>
                    </p>

                    <div className="mb-4">
                        {myBook ? (
                            <label className="font-semibold text-gray-700 mr-4 whitespace-normal text-sm sm:text-base">
                                Rental Period: {book?.maxDays} days:
                            </label>
                        ) : (
                            <div className="flex flex-col md:flex-row mb-4">
                                <label className="font-semibold text-gray-700 mr-4 whitespace-normal text-sm sm:text-base">
                                    Choose Rental Period (within {book?.minDays}{" "}
                                    - {book?.maxDays} days):
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
                        <label className="font-semibold text-gray-700 mr-2">
                            Quantity :
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

                    <p className="text-lg mb-4">
                        <span className="font-mono text-gray-500 underline decoration-zinc-400 mb-1">
                            About
                        </span>
                        <span
                            className={`data font-mono ${
                                isExpanded ? "" : "line-clamp-2"
                            } transition-all duration-300 ease-in-out`}>
                            {book.description}
                        </span>
                        {book.description.length > 100 && (
                            <button
                                onClick={toggleReadMore}
                                className="text-blue-600 cursor-pointer hover:underline px-2">
                                {isExpanded ? "Read Less" : "Read More"}
                            </button>
                        )}
                    </p>
                </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default BookDetailPage;
