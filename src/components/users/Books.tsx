import React, { useEffect, useState } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Books: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await userAxiosInstance.get(
                    "/books/available-for-rent"
                );

                setBooks(response.data?.books);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "An error occurred while fetching books, please try again later"
                    );
                }
            }
        };

        fetchBooks();
    }, []);

    if (books.length == 0) return null;
    return (
        <div className="p-5 mt-12 px-12">
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {books.slice(0, 10).map((book) => (
                         <Link to={`/book/${book._id}`}>
                        <div
                            key={book._id}
                            className="bg-white p-4"
                            >
                            <img
                                src={book.images[0]}
                                alt={book.name}
                                className="rounded-md mb-4 w-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                     style={{height:'350px'}}
                            />
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Books;
