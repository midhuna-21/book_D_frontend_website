import React, { useEffect, useState } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { Link } from "react-router-dom";
import {toast} from 'sonner'

const Books: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await userAxiosInstance.get(
                    "/books/available-for-rent"
                );

                setBooks(response.data);
            } catch (error:any) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred while fetching books, please try again later");
                }
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className="container mb-14 mt-14">
            <div className="flex flex-col items-center">
                <div className="w-full py-6 mb-6 border-b border-gray-200">
                    <h2 className="text-2xl font-serif underline flex justify-center items-center md:text-3xl">
                        Top Books
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {books.slice(0, 5).map((book) => (
                        <div
                            key={book._id}
                            className="bg-white p-4 rounded-xl hover:border border-gray-200 hover:shadow-md"
                            style={{ width: "250px", height: "450px" }}>
                            <img
                                src={book.images[0]}
                                alt={book.name}
                                className="rounded-md mb-4 w-full h-48 object-cover"
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

                                {/* <div className="flex items-center justify-center mb-2">
                                    <FaStar className="text-yellow-400" />
                                    <FaStar className="text-yellow-400" />
                                    <FaStar className="text-yellow-400" />
                                    <FaStar className="text-yellow-400" />
                                    <FaStar className="text-gray-300" />
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    4.0 (120 reviews)
                                </p> */}
                                <Link to={`/book/${book._id}`}>
                                    <button
                                        className="bg-stone-700 hover:bg-stone-400 hover:text-black text-white px-4 py-2 rounded-md transition-colors duration-300"
                                        style={{
                                            width: "100px",
                                            height: "40px",
                                        }}>
                                        Choose
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Books;
