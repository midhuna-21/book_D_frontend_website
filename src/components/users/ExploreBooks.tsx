import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../utils/api/axiosInstance';
import {Link,useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import { RootState } from '../../utils/ReduxStore/store/store';
import { FaGreaterThan, FaLessThan } from 'react-icons/fa';

const ExploreBooks: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const userInfo = useSelector((state: RootState) => state.user.userInfo?.user);
  const name = userInfo?.name || "";
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || ''; 
  const genreName = location.state?.genreName || "";


  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let endpoint = '/books';
        if(searchQuery){
          endpoint = `/search/${searchQuery}`;
        }
        if(genreName){
          endpoint = `/genre-books/${genreName}`
        }
       console.log(endpoint,'endpoint')
        const response = await userAxiosInstance.get(endpoint);

        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.warn("Expected an array but got:", response.data);
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genreName,searchQuery, userInfo]);

  const showShimmer = loading || books.length === 0;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="container mx-auto bg-white shadow-md p-12">
    <div className="mb-12 flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold text-gray-700">Hello, {name}!</h1>
      <p className="text-sm text-gray-600 mt-2">
        {books.length === 0 ? (
          <span>
            <span>Currently, books are not available. Please wait </span>
            <span className="text-red-500 font-bold text-lg ml-1">!</span>
          </span>
        ) : (
          "Dive into the world of books and start your reading journey with us."
        )}
      </p>
    </div>

    {showShimmer ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 shadow-md w-72 h-80 mx-auto"
          ></div>
        ))}
      </div>
    ) : (
      <>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
  {currentBooks.map((book) => (
    <Link
      to={`/home/book/${book._id}`}
      key={book._id}
      className="relative group">
      <div className="relative group flex flex-col items-center bg-white shadow-md w-72 mx-auto h-[420px]">

        <img
          src={book.images[0]}
          alt={book.bookTitle}
          className="w-full h-[350px] object-fit  transition-opacity duration-300 group-hover:opacity-80"
        />
        <div className="p-4 text-center flex-grow">
          <button className="button-profile-photo-box h-10 w-40 justify-center items-center shadow-xl font-serif">
            View Details
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            <FaLessThan />
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={indexOfLastBook >= books.length}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            <FaGreaterThan />
          </button>
        </div>
      </>
    )}
  </div>

  );
};

export default ExploreBooks;
