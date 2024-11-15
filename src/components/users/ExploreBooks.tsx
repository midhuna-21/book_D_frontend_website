import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { FaGreaterThan, FaBookReader, FaLessThan } from "react-icons/fa";
import { Box, Flex, Icon } from "@chakra-ui/react";
import {toast} from 'sonner';

const ExploreRentalBooks: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const userInfo = useSelector((state: RootState) => state.user?.userInfo);
    const name = userInfo?.name || "";
    const location = useLocation();
    const searchQuery = location.state?.searchQuery || "";
    const genreName = location.state?.genreName || "";
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                let endpoint = "/books/available-for-rent";
                if (searchQuery) {
                    endpoint = `/books/search/${searchQuery}`;
                }
                if (genreName) {
                    endpoint = `/genres/books/${genreName}`;
                }

                const response = await userAxiosInstance.get(endpoint);

                if (Array.isArray(response.data)) {
                    setBooks(response.data);
                } else {
                    console.warn("Expected an array but got:", response.data);
                    setBooks([]);
                }
            } catch (error:any) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, please try again later");
                }
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [genreName, searchQuery, userInfo]);

    const showShimmer = loading || books.length === 0;

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    return (
        <div className="container mx-auto py-24">
            <div className=" flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-gray-700">
                    Hello, {name}!
                </h1>
                <p className="text-sm text-gray-600 mt-2 md:p-1 p-5">
                    {books.length === 0 ? (
                        <span>
                            <span>
                                Currently, books are not available. Please wait{" "}
                            </span>
                            <span className="text-red-500 font-bold text-lg ml-1">
                                !
                            </span>
                        </span>
                    ) : (
                        "Dive into the world of books and start your reading journey with us."
                    )}
                </p>
            </div>

            <div className="flex justify-center items-center md:mb-8 mb-5">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-3">
                        {currentBooks.map((book) => (
                            
                            <Link to={`/book/${book._id}`}>
                            <div
                                key={book._id}
                                className="p-4   border border-gray-200 shadow-md rounded-lg hover:shadow-2xl"
                                >
                                <div className="relative w-full h-72">
                                    {" "}
                                    <img
                                        src={book.images[0]}
                                        alt={book.name}
                                        className="absolute inset-0 w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col items-center text-center h-full">
                                    <h3
                                        className="text-lg font-bold mt-3 overflow-hidden"
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

                                        {/* <button
                                            className="bg-stone-700 hover:bg-stone-400 hover:text-black text-white px-4 py-2 rounded-md transition-colors duration-300"
                                            style={{
                                                width: "100px",
                                                height: "40px",
                                            }}>
                                            Choose
                                        </button> */}
                                    
                                </div>

                            </div>
                            </Link>
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

export default ExploreRentalBooks;
