import React, { useEffect, useState } from 'react';
import { userAxiosInstance } from '../../utils/api/axiosInstance';

const Books: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await userAxiosInstance.get('/books'); 
        console.log(response?.data?.bookTitle,'book repsoe')
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto py-20 px-20 ">
    <div className="flex flex-col items-center">
        <div className="bg- w-full px-12 py-6 mb-6 border-b border-gray-200">
            <h2 className="text-3xl font-serif underline">Books For Sell</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-8">
            {books.slice(0, 8).map((book) => (
                <div key={book._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-md" style={{ width: "250px", height: "370px" }}>
                    <img src={book.images[0]} alt={book.name} className="rounded-md mb-2 w-full h-48 object-cover" />
                    <div className="flex flex-col items-center justify-between h-full">
                        <div className="text-center">
                            <h3 className="text-lg font-bold mb-1">{book.bookTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.description.length > 100 ? `${book.description.substring(0, 100)}...` : book.description}</p>
                        <button
                            className="bg-stone-700 hover:bg-stone-400 hover:text-black text-white px-4 py-2 rounded-md transition-colors duration-300"
                            onClick={() => console.log(`Chose ${book.name}`)}
                            >
                            Choose
                        </button>
                          </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>


  );
};

export default Books;
