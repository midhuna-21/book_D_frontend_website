import React from "react";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaExchangeAlt, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const DetailsOfRent: React.FC = () => {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-8 text-gray-800">
      <h2 className="text-center text-4xl font-serif mb-8 underline">How It Works</h2>
    
    <div className="flex flex-row gap-12 mt-12">
    <div className="mb-10">
          <h3 className="text-2xl font-serif mb-6">How to Rent a Book</h3>
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
      <div className="ml-12 px-12">
          <h3 className="text-2xl font-serif mb-6 ">How to Lend a Book</h3>
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
  </div>
    );
};

export default DetailsOfRent;
