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

    const showBookDetails = (bookId:string) => {
        let mybooks = true;
       navigate(`/home/book/${bookId}`,{state:{from : mybooks}})
    };
    return (
        <div className="p-6 rounded-lg ">
        {loading ? (
            <p>Loading books...</p>
        ) : error ? (
            <p className="text-red-500">{error}</p>
        ) : books.length === 0 ? (
            <p>No books available in this category.</p>
        ) : (
            <div>
               <div className="flex flex-col space-y-6 lg:space-y-0 lg:space-x-6 lg:flex-row lg:flex-wrap justify-center">
  {currentBooks.map((book) => (
    <div
      key={book._id}
      className="relative bg-white p-4 rounded-lg shadow-lg mb-6 w-full lg:w-[22%]">
      <div className="w-full">
        {book.images && book.images.length > 0 ? (
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop={true}
            className="w-full h-full">
            {book.images.map((image: string, index: number) => (
              <div
                key={index}
                className="w-full h-64 lg:h-80 relative cursor-pointer"
                onClick={() => showBookDetails(book._id)}>
                <img
                  src={image}
                  alt={`Book ${index}`}
                  className="w-full h-full object-fit rounded-lg shadow-md"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <img
            src={book.images && book.images.length > 0 ? book.images[0] : ""}
            alt="Book"
            className="w-full h-64 lg:h-80 object-fit rounded-lg shadow-md cursor-pointer"
            onClick={() => showBookDetails(book._id)}
          />
        )}
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
