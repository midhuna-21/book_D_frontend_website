import React,{useState} from "react";
import { FaSearch,FaTimes, FaCheckCircle, FaTimesCircle, FaExchangeAlt, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const HowItWorks: React.FC = () => {

    const [isRentModalOpen, setIsRentModalOpen] = useState(false);
    const [isLendModalOpen, setIsLendModalOpen] = useState(false);


    const openRentModal = () => setIsRentModalOpen(true);
    const closeRentModal = () => setIsRentModalOpen(false);
    
    const openLendModal = () => setIsLendModalOpen(true);
    const closeLendModal = () => setIsLendModalOpen(false);
    return (
      <div 
      className="container mx-auto px-8 mb-12 flex justify-center items-center"
      >
      <div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl"
      >
          
          <div 
          onClick={openRentModal}
          className="bg-cyan-500 hover:bg-box1 text-white p-8 rounded-lg shadow-md transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold mb-4">How to Rent a Book</h3>
              <p className="text-center">Learn the steps to easily rent a book through our platform.</p>
          </div>

          <div 
          onClick={openLendModal}
          className="bg-box2 hover:bg-box4 text-white p-8 rounded-lg shadow-md transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold mb-4">How to Lend a Book</h3>
              <p className="text-center">Discover how you can lend your book and help others read.</p>
          </div>

      </div>
      {isRentModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
          <FaTimes 
          className="absolute top-4 right-4 text-3xl cursor-pointer text-gray-500 hover:text-red-600 transition-colors" 
          onClick={closeRentModal}
        />
            <h2 className="text-3xl font-serif mb-4">How to Rent a Book</h2>
                <ol className="list-decimal list-inside space-y-4">
                    <li className="flex items-start">
                        <FaSearch className="text-2xl mr-3 text-blue-500" />
                        <span>Search for a book you want to rent.</span>
                    </li>
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>Select the book and request to rent it from the owner.</span>
                    </li>
                    <li className="flex items-start">
                        <FaMapMarkerAlt className="text-2xl mr-3 text-red-500" />
                        <span>Check the details: how long you can keep the book, and ensure it’s available within your desired location range.</span>
                    </li>
                    <li className="flex items-start">
                        <FaTimesCircle className="text-2xl mr-3 text-yellow-500" />
                        <span>If your request is rejected, you’ll receive a notification and won't be able to rent the book.</span>
                    </li>
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>If accepted, you’ll receive a payment link. Complete the payment within 24 hours.</span>
                    </li>
                    <li className="flex items-start">
                        <FaMapMarkerAlt className="text-2xl mr-3 text-red-500" />
                        <span>Pick up the book from the owner within 5 days after the payment is confirmed.</span>
                    </li>
                    <li className="flex items-start">
                        <FaExchangeAlt className="text-2xl mr-3 text-orange-500" />
                        <span>Both you and the owner need to update the book status for confirmation of the handover.</span>
                    </li>
                    <li className="flex items-start">
                        <FaMoneyBillWave className="text-2xl mr-3 text-green-500" />
                        <span>If the handover isn't completed, you'll get a refund, and the book will no longer be available to you.</span>
                    </li>
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>Return the book within the agreed-upon timeframe, and update the status once it’s returned.</span>
                    </li>
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>Both you and the owner need to update the status to confirm the return. Once confirmed, you’ll receive your security deposit.</span>
                    </li>
                    <li className="flex items-start">
                        <FaTimesCircle className="text-2xl mr-3 text-red-500" />
                        <span>If you damage the book or fail to return it, the security deposit will go to the owner.</span>
                    </li>
                </ol>
            </div>
        </div>
      )}
            {isLendModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
          <FaTimes 
          className="absolute top-4 right-4 text-3xl cursor-pointer text-gray-500 hover:text-red-600 transition-colors" 
          onClick={closeLendModal}
        />
            <h2 className="text-3xl font-serif mb-4">How to Lend a Book</h2>
            <ol className="list-decimal list-inside space-y-4">
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>Go to the 'Rent Book' section and fill out the form with all required details, including your location.</span>
                    </li>
                    <li className="flex items-start">
                        <FaMapMarkerAlt className="text-2xl mr-3 text-red-500" />
                        <span>Make sure the location is correct and the book’s availability is clear.</span>
                    </li>
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>Once you submit, your book will be listed for rent.</span>
                    </li>
                    <li className="flex items-start">
                        <FaExchangeAlt className="text-2xl mr-3 text-orange-500" />
                        <span>Wait for users to request the book. You can either accept or reject their request.</span>
                    </li>
                    <li className="flex items-start">
                        <FaMoneyBillWave className="text-2xl mr-3 text-green-500" />
                        <span>If you accept, the user will be sent a payment link. After payment, they’ll pick up the book from you.</span>
                    </li>
                    <li className="flex items-start">
                        <FaExchangeAlt className="text-2xl mr-3 text-orange-500" />
                        <span>Both you and the user need to update the book’s status for confirmation of handover.</span>
                    </li>
                    <li className="flex items-start">
                        <FaCheckCircle className="text-2xl mr-3 text-green-500" />
                        <span>After the user returns the book, both parties must update the status again to confirm the return.</span>
                    </li>
                    <li className="flex items-start">
                        <FaMoneyBillWave className="text-2xl mr-3 text-green-500" />
                        <span>Once confirmed, the payment will be transferred to your account.</span>
                    </li>
                    </ol>
         </div>
        </div>
      )}
    </div>

    );
};

export default HowItWorks;
