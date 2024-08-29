import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MyBooks: React.FC = () => {
    const [view, setView] = useState<"rentedBooks" | "soldBooks">(
        "rentedBooks"
    );
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

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

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
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
                <button
                    className={`px-4 py-2 rounded-md ${
                        view === "soldBooks"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setView("soldBooks")}>
                    Sell Books
                </button>
            </div>

            {loading ? (
                <p>Loading books...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : books.length === 0 ? (
                <p>No books available in this category.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="flex flex-col lg:flex-row bg-white p-4 rounded-lg shadow-md mb-4 "
                            style={{ width: "50%" }}>
                            <div className="w-32 lg:w-1/2 h-80 relative">
                                {book.images && book.images.length > 0 ? (
                                    <Carousel
                                        showThumbs={false}
                                        className="w-full h-full"
                                        showStatus={false}
                                        showIndicators={false}
                                        infiniteLoop={true}>
                                        {book.images.map(
                                            (image: string, index: number) => (
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
                                <h3 className="text-xl font-serif mb-3 text-gray-900 ">
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
            )}
        </div>
    );
};

export default MyBooks;
