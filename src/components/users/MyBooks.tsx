import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bookdImage from "../../assets/book-learning.png";
import { motion } from "framer-motion";
import { FaGreaterThan, FaLessThan, FaBookReader } from "react-icons/fa";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UserLendBooks: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await userAxiosInstance.get(
                    "/books/lent-books"
                );
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const booksPerPage = 10;

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const showBookDetails = (bookId: string) => {
        let mybooks = true;
        navigate(`/book/${bookId}`, { state: { from: mybooks } });
    };
    // const showShimmer = loading || books.length === 0;

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
    if (books.length == 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.img
                    src={bookdImage}
                    alt="Empty Books"
                    className="w-56 h-42 mb-4"
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />
                <div className="text-center">
                    <p className="text-gray-600 text-md font-semibold">
                        Unlock the value of your library.
                    </p>
                    <p className="text-gray-600 text-md font-semibold">
                        Lend your books and inspire the next reader!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-24 min-h-screen p-4">
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
                    <Link to="/lend-book">
                        <button className="mt-4 text-gray-600 text-sm border-2 p-1 border-gray-500 rounded-lg flex items-center flex-col hover:bg-gray-700 hover:text-white">
                            {/* <FaPlusCircle className="text-3xl mr-2" /> */}
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
            {/* {showShimmer ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse bg-gray-200 shadow-md w-72 h-80 mx-auto"></div>
                    ))}
                </div>
            ) : ( */}
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-3 ">
                    {currentBooks.map((book) => (
                        <div
                            key={book._id}
                            className="p-4 border border-gray-200 shadow-md rounded-lg hover:shadow-2xl"
                            onClick={() => showBookDetails(book._id)}>
                            <div className="relative w-full h-72">
                                {" "}
                                <img
                                    src={book.images[0]}
                                    alt={book.name}
                                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                                />
                            </div>
                            <div className="flex flex-col items-center text-center mt-4">
                                <h3
                                    className="text-lg font-bold mb-3 overflow-hidden"
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
                                {/* 
                                    <button className="bg-stone-700 hover:bg-stone-400 hover:text-black text-white px-4 py-2 rounded-md transition-colors duration-300 w-1/2 md:w-full">
                                        Choose
                                    </button> */}
                            </div>
                        </div>
                    ))}
                </div>

                {books.length > 8 && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
                            <FaLessThan />
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={indexOfLastBook >= books.length}
                            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
                            <FaGreaterThan />
                        </button>
                    </div>
                )}
            </>
            {/* )} */}
        </div>
    );
};

export default UserLendBooks;
