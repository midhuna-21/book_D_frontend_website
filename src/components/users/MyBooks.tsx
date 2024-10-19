import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
    FaGreaterThan,
    FaLessThan,
    FaPlusCircle,
    FaBookReader,
    FaStar,
} from "react-icons/fa";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const MyBooks: React.FC = () => {
    const [view, setView] = useState<"rentedBooks" | "soldBooks">(
        "rentedBooks"
    );
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState<{
        [key: string]: boolean;
    }>({});
    const navigate = useNavigate();

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

    const booksPerPage = 10;

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const showBookDetails = (bookId: string) => {
        let mybooks = true;
        navigate(`/home/book/${bookId}`, { state: { from: mybooks } });
    };
    const showShimmer = loading || books.length === 0;

    return (
        <div className="container mx-auto p-12">
            <div className="mb-6 flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-gray-700">
                    Your Book Collection
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                    {books.length === 0 ? (
                        <span className="flex items-center">
                            <span>
                                You haven't added any books yet. Start building
                                your collection now!
                            </span>
                            <span className="text-red-500 font-bold text-lg ml-1">
                                !
                            </span>
                        </span>
                    ) : (
                        "Here are the books you've added:"
                    )}
                </p>
                {books.length === 0 && (
                    <Link to="/home/add-book">
                        <button className="mt-4 text-gray-400 text-lg flex items-center flex-col">
                            <FaPlusCircle className="text-3xl mr-2" />
                            Add Books
                        </button>
                    </Link>
                )}
            </div>

            <div className="flex justify-center items-center mb-8">
                <Flex align="center" width="10%" mt="2">
                    <Box h="1px" bg="grey" flex="1" />
                    <Icon
                        as={FaBookReader}
                        mx="2"
                        bg="gray.200"
                        p="2"
                        borderRadius="50%"
                        boxSize="1.5em"
                    />
                    <Box h="1px" bg="grey" flex="1" />
                </Flex>
            </div>
            {showShimmer ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse bg-gray-200 shadow-md w-72 h-80 mx-auto"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5">
                        {currentBooks.map((book) => (
                            <div
                                key={book._id}
                                className="bg-white p-4 border border-gray-200 shadow-md mt-5"
                                style={{ width: "250px", height: "450px" }}
                                onClick={() => showBookDetails(book._id)}>
                                <img
                                    src={book.images[0]}
                                    alt={book.name}
                                    className="mb-4 w-full h-48 object-cover"
                                />
                                <div className="flex flex-col items-center text-center h-full">
                                    <h3
                                        className="text-lg font-bold mb-1 overflow-hidden"
                                        style={{
                                            height: "40px",
                                            lineHeight: "1.2em",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}>
                                        {book.bookTitle.length > 40
                                            ? `${book.bookTitle.substring(
                                                  0,
                                                  40
                                              )}...`
                                            : book.bookTitle}
                                    </h3>

                                    <p
                                        className="text-sm text-gray-600 mb-2 overflow-hidden"
                                        style={{
                                            height: "60px",
                                            lineHeight: "1.5em",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                        }}>
                                        {book.description.length > 100
                                            ? `${book.description.substring(
                                                  0,
                                                  100
                                              )}...`
                                            : book.description}
                                    </p>

                                    <div className="flex items-center justify-center mb-2">
                                        <FaStar className="text-yellow-400" />
                                        <FaStar className="text-yellow-400" />
                                        <FaStar className="text-yellow-400" />
                                        <FaStar className="text-yellow-400" />
                                        <FaStar className="text-gray-300" />
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">
                                        4.0 (120 reviews)
                                    </p>
                                    <button
                                        className="bg-stone-700 hover:bg-stone-400 hover:text-black text-white px-4 py-2 rounded-md transition-colors duration-300"
                                        style={{
                                            width: "100px",
                                            height: "40px",
                                        }}
                                        onClick={() =>
                                            console.log(`Chose ${book.name}`)
                                        }>
                                        Choose
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {books.length > 8 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
                                <FaLessThan />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                                disabled={indexOfLastBook >= books.length}
                                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
                                <FaGreaterThan />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyBooks;
