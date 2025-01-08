import React, { useState, useEffect,useCallback } from "react";
import { debounce } from "lodash";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { FaGreaterThan, FaBookReader, FaLessThan } from "react-icons/fa";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { toast } from "sonner";
import bookImage from "../../assets/book-learning.png";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const ExploreRentalBooks: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const booksPerPage = 10;
    const userInfo = useSelector((state: RootState) => state.user?.userInfo);
    const name = userInfo?.name || "";
    const location = useLocation();
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const genreName = location.state?.genreName || "";
    const [genres, setGenres] = useState<any[]>([]);
    const [isGenreDropdownVisible, setIsGenreDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const limit = 10;
    const [currentGenre, setCurrentGenre] = useState<string>(genreName);
    const navigate = useNavigate();

    const debounceSearch = useCallback(
        debounce((query: string) => {
            setDebouncedSearchQuery(query);
        }, 1000), 
        []
    );
    
    const fetchBooks = async (page: number) => {
        try {
            setLoading(true);

            
            const response = await userAxiosInstance.get(
                "/books/available-for-rent",
                {
                    params: {
                        page,
                        limit: booksPerPage,
                        searchQuery:debouncedSearchQuery,
                        genreName: currentGenre || selectedGenre || "",
                    },
                }
            );
            setBooks(response.data.books);
            setTotalPages(Math.ceil(response.data.totalBooks / booksPerPage));
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBooks(currentPage);
    }, [currentPage, debouncedSearchQuery, selectedGenre, currentGenre]);

    const handleGenreSelect = (genreName: string) => {
        setCurrentGenre("");

        setSelectedGenre(genreName);
        setCurrentPage(1);
        setIsGenreDropdownVisible(false);
    };
    const handleGenre = async () => {
        const genreResponse = await userAxiosInstance.get("/books/genres");
        setGenres(genreResponse?.data);
        setIsGenreDropdownVisible((prev) => !prev);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentGenre("");
        const value = e.target.value;
        setSearchQuery(value);
        debounceSearch(value);
        setCurrentPage(1);
    };

    const handleBooks = () => {
        navigate(location.pathname, { replace: true, state: {} });
        location.state.genreName = "";
        setCurrentGenre("");
        setSelectedGenre(null);
        setSearchQuery("");
        debounceSearch("");
        setCurrentPage(1);
    };

    const emptyBooks = books.length === 0;

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);


    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
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
    if (!books) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse bg-gray-200 shadow-md w-72 h-80 mx-auto"></div>
                ))}
            </div>

            // <div>
            //     <Spinner />
            // </div>
        );
    }
    return (
        <div className="min-h-screen py-24 p-4">
            <div className="mb-6 flex items-center justify-center flex-col">
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

            <div className="flex justify-center items-center md:mb-8 mb-5 ">
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

            <>
                <div className="w-full md:w-auto ml-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by book's name, author, publisher, location...."
                        className="w-full md:w-[400px] px-4 py-2 text-sm border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <button
                        onClick={handleBooks}
                        className="border-2 text-gray-600 px-4 py-2 rounded-md mb-5 ml-3 hover:shadow-md shadow-sm">
                        All Books
                    </button>
                    <button
                        onClick={() => handleGenre()}
                        className="border-2 text-gray-600 px-4 py-2 rounded-md mb-5 ml-3 hover:shadow-md shadow-sm">
                        {selectedGenre ? `${selectedGenre}` : "Pick Genre"}
                    </button>

                    {isGenreDropdownVisible && (
                        <div className="absolute bg-white shadow-lg  w-auto max-w-full z-10 p-3 border border-gray-400 ">
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                                {genres.map((genre) => (
                                    <li
                                        key={genre._id}
                                        onClick={() =>
                                            handleGenreSelect(genre.genreName)
                                        }
                                        className="cursor-pointer hover:bg-gray-200 p-2 flex justify-center items-center">
                                        {genre.genreName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {emptyBooks ? (
                    <div className="flex flex-col items-center justify-center">
                        <ClipLoader
                            size={50}
                            color={"#3498db"}
                            loading={loading}
                        />
                        <motion.img
                            src={bookImage}
                            alt="Empty books"
                            className="w-56 h-42 mb-4"
                            // animate={{
                            //     y: [0, -10, 0],
                            // }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "loop",
                            }}
                        />
                        <div className="text-center">
                            <p className="text-gray-600 text-md font-semibold">
                                Sorry, We couldn’t find any books that match
                                your search.
                            </p>
                            <p className="text-gray-600 text-md font-semibold">
                                Check back later for updates!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-3 min-h-screen">
                    {books.map((book) => (
                      <Link to={`/book/${book._id}`} key={book._id}>
                        <div className="p-4">
                          <div 
                          style={{height:'350px'}}
                           className="relative "> 
                            <img
                              src={book.images[0]}
                              alt={book.name}
                              className="absolute inset-0 w-full h-full object-cover rounded-md transition-transform duration-300 ease-in-out transform hover:scale-105"
                />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  
                )}
                {books.length > 0 && (
                 <div className="px-12 flex items-center justify-center py-6">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-gray-700 rounded disabled:opacity-50">
                    <FaLessThan />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 mx-1 rounded ${
                            currentPage === page
                                ? "bg-cyan-800 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}>
                        {page}
                    </button>
                ))}

                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-gray-700 rounded disabled:opacity-50">
                    <FaGreaterThan />
                </button>
            </div>
                )}
            </>
        </div>
    );
};

export default ExploreRentalBooks;
