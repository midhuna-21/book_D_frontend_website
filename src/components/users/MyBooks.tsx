import React, { useState, useEffect, } from "react";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import {useNavigate} from 'react-router-dom';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaGreaterThan, FaLessThan,FaEllipsisV } from "react-icons/fa";

const MyBooks: React.FC = () => {
    const [view, setView] = useState<"rentedBooks" | "soldBooks">(
        "rentedBooks"
    );
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
    const navigate = useNavigate();
 
    const booksPerPage = 4;
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint =
                    view === "rentedBooks" ? "/rented-books" : "/sold-books";
                const response = await userAxiosInstance.get(endpoint);
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [view]);

    const toggleReadMore = (bookId: string) => {
        setExpanded((prevState) => ({
            ...prevState,
            [bookId]: !prevState[bookId],
        }));
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook); 

    const totalPages = Math.ceil(books.length / booksPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    const toggleDropdown = (bookId: string) => {
        setDropdownOpen((prevState) => ({
            ...prevState,
            [bookId]: !prevState[bookId],
        }));
    };
    const handleListToggle = (bookId: string) => {
        console.log(`Toggled list status for book ${bookId}`);
    };

    const handleEdit = (bookId: string) => {
        navigate(`/home/edit-book/${bookId}`)
        // console.log(`Editing book ${bookId}`);
    };
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-12">
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-md ${
                        view === "rentedBooks"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setView("rentedBooks")}>
                    Rent Books
                </button>
                {/* <button
                    className={`px-4 py-2 rounded-md ${
                        view === "soldBooks"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setView("soldBooks")}>
                    Sell Books
                </button> */}
            </div>

            {loading ? (
                <p>Loading books...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : books.length === 0 ? (
                <p>No books available in this category.</p>
            ) : (
                <div>
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {" "}
                        {currentBooks.map((book) => (
                            <div
                                key={book._id}
                                className="relative flex flex-col lg:flex-row bg-white p-1 rounded-lg shadow-md mb-4">
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => toggleDropdown(book._id)}
                                        className="text-gray-600 hover:text-gray-800">
                                        <FaEllipsisV />
                                    </button>
                                    {dropdownOpen[book._id] && (
                                         <div className="absolute right-0 mt-1 py-1 bg-white rounded-lg shadow-xl z-20 w-28">   <button
                                                onClick={() => handleEdit(book._id)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleListToggle(book._id)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                                {book.isListed ? "Unlist" : "List"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="w-50 lg:w-1/2 h-80 relative md:32">
                                    {book.images && book.images.length > 0 ? (
                                        <Carousel
                                            showThumbs={false}
                                            className="w-full h-full"
                                            showStatus={false}
                                            showIndicators={false}
                                            infiniteLoop={true}>
                                            {book.images.map(
                                                (
                                                    image: string,
                                                    index: number
                                                ) => (
                                                    <div
                                                        key={index}
                                                        className="w-full h-full relative">
                                                        <img
                                                            src={image}
                                                            alt={`Book ${index}`}
                                                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </Carousel>
                                    ) : ( 
                                        <img
                                            src={
                                                book.images &&
                                                book.images.length > 0
                                                    ? book.images[0]
                                                    : ""
                                            }
                                            alt="Book"
                                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                                        />
                                    )}
                                </div>

                                <div className="w-full lg:w-1/2 text-gray-800 p-6 flex flex-col bg-white rounded-lg shadow-md">
                                    <h3 className="text-xl font-serif mb-3 text-gray-900">
                                        {book.bookTitle}
                                    </h3>
                                    <p className="text-md mb-1">
                                        <span className="font-medium text-gray-700">
                                            Author:
                                        </span>{" "}
                                        {book.author}
                                    </p>
                                    <p className="text-md mb-1">
                                        <span className="font-medium text-gray-700">
                                            Published Year:
                                        </span>{" "}
                                        {book.publishedYear}
                                    </p>
                                    <p className="text-md mb-1">
                                        <span className="font-medium text-gray-700">
                                            Genre:
                                        </span>{" "}
                                        {book.genre}
                                    </p>
                                    <p className="text-md mb-1">
                                        <span className="font-medium text-gray-700">
                                            Publisher:
                                        </span>{" "}
                                        {book.publisher}
                                    </p>
                                    {view === "rentedBooks" ? (
                                        <p className="text-md mb-2">
                                            <span className="font-medium text-gray-700">
                                                Rental Fee:
                                            </span>{" "}
                                            {book.rentalFee}
                                        </p>
                                    ) : (
                                        <p className="text-md mb-2">
                                            <span className="font-medium text-gray-700">
                                                Price:
                                            </span>{" "}
                                            {book.price}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        <span className="font-medium text-gray-700">
                                            Description:
                                        </span>{" "}
                                        {expanded[book._id] ||
                                        book.description.length <= 150 ? (
                                            <span>{book.description}</span>
                                        ) : (
                                            <span>{`${book.description.slice(
                                                0,
                                                150
                                            )}... `}</span>
                                        )}
                                        {book.description.length > 150 && (
                                            <span
                                                className="text-blue-600 cursor-pointer font-medium hover:underline"
                                                onClick={() =>
                                                    toggleReadMore(book._id)
                                                }>
                                                {expanded[book._id]
                                                    ? " Read Less"
                                                    : " Read More"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-gray-700 text-center">
                        {currentPage} of {totalPages}
                    </p>

                    <div className="flex justify-center items-center mt-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md bg-gray-200 text-gray-800 mx-2 ${
                                currentPage === 1
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-300"
                            }`}>
                            <FaLessThan />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md bg-gray-200 text-gray-800 mx-2 ${
                                currentPage === totalPages
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-300"
                            }`}>
                            <FaGreaterThan />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBooks;
