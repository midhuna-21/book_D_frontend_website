  import  { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import {
      FaHome,
  } from "react-icons/fa";
  import { userAxiosInstance } from "../../utils/api/axiosInstance";
  import { useSelector } from "react-redux";
  import { RootState } from "../../utils/ReduxStore/store/store";
  // import { Elements } from "@stripe/react-stripe-js";
  import { loadStripe,Stripe } from "@stripe/stripe-js";
  // import Payment from "./Payment";



  const LenderDetails = () => {
      const { requestId } = useParams();
      const [bookDetails, setBookDetails] = useState<any>(null);
      const userInfo = useSelector(
          (state: RootState) => state?.user?.userInfo?.user
      );
      const userId = userInfo?._id;
      const [isAgreed, setIsAgreed] = useState(false);

      useEffect(() => {
          const fetchDetails = async () => {
              try {
                  const response = await userAxiosInstance.get(
                      `/lending-details/${requestId}`
                  );
                  setBookDetails(response?.data?.details);
              } catch (error) {
                  console.error("Error fetching book details", error);
              }
          };

          fetchDetails();
      }, [requestId]);

      const handleAgreeChange = () => {
          setIsAgreed(!isAgreed);
      };

      if (!bookDetails) {
          return <div>Loading...</div>;
      }


      // payment integration
      
      const makePayment = async () => {
        const stripePromise: Stripe | null = await loadStripe(
          "pk_test_51PsQIxJLTsyLCzN2DBw1f6Od4OEh0vdO34mKYQmfUgomCnP0D7IegGNMvKaZdF8zYjrIb8r6pYOppVveK24egrWn00CdaN0RvG"
        );
      
        const body = {
          requestId:bookDetails?._id,
          bookId:bookDetails?.bookId?._id,
          bookTitle:bookDetails?.bookId?.bookTitle,
          userId:userId,
          lenderId:bookDetails?.bookId?.lenderId,
          totalPrice:totalPrice,
          quantity:bookDetails?.quantity,
          depositAmount:bookDetails?.bookId?.extraFee
        };
      
        const headers = {
          "Content-Type": "application/json",
        };
      
        try {
          if (stripePromise) {
            const response = await userAxiosInstance.post('/create-checkout', body, { headers });
      
            const result = await stripePromise.redirectToCheckout({
              sessionId: response.data.id,
            });

            const data={
                bookId:bookDetails?.bookId?._id,
                userId:userId,
                lenderId:bookDetails?.bookId?.lenderId,
                totalPrice:totalPrice,
                quantity:bookDetails?.quantity,
                depositAmount:bookDetails?.bookId?.extraFee
            }
            
            console.log(data,'data')
            const createOrder = await userAxiosInstance.post('/create-order',data,{withCredentials:true})
             
            if (result.error) {
              console.error("Error redirecting to checkout:", result.error.message);
              return;
            }

               
            
          } else {
            console.error("Stripe initialization failed");
          }
        } catch (error) {
          console.error("Error creating checkout session:", error);
        }
      };
   
      
    //   const makePayment = async () => {
    //     const stripePromise: Stripe | null = await loadStripe(
    //       "pk_test_51PsQIxJLTsyLCzN2DBw1f6Od4OEh0vdO34mKYQmfUgomCnP0D7IegGNMvKaZdF8zYjrIb8r6pYOppVveK24egrWn00CdaN0RvG"
    //     );
      
    //     const body = {
    //       bookTitle: bookDetails?.bookId?.bookTitle,
    //       totalPrice: totalPrice,
    //       requestId: requestId,
    //       quantity: bookDetails?.quantity,
    //     };
      
    //     const headers = {
    //       "Content-Type": "application/json",
    //     };
      
    //     try {
    //       const response = await userAxiosInstance.post('/create-checkout', body, { headers });
          
    //       console.log("Checkout session response:", response.data);
      
    //       if (response.data && response.data.id) {
    //         const result = await stripePromise.redirectToCheckout({
    //           sessionId: response.data.id,
    //         });
    //         console.log("Redirect to checkout result:", result); 
    //       } else {
    //         console.error("Error: No session ID returned from server.");
    //       }
    //     } catch (error) {
    //       console.error("Error creating checkout session:", error);
    //     }
    //   };
      
      
      const totalPrice =
          bookDetails?.bookId?.extraFee + bookDetails?.totalRentalPrice;

      return (
        <div className="flex flex-col lg:flex-row items-center justify-center py-12 bg-gray-50 min-h-screen gap-10 px-12">
        <div className="p-6 w-full lg:w-1/2 bg-white shadow-lg rounded-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Payment Checkout
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              To complete your book rental, please proceed with the payment within the next 24 hours.
            </p>
          </div>
      
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Lender Details
            </h2>
            <div className="flex flex-row gap-12">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Name
                </h3>
                <p className="text-gray-600">
                  {bookDetails?.receiverId?.name}
                </p>
              </div>
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Phone Number
                </h3>
                <p className="text-gray-600">
                  {bookDetails?.receiverId?.phone}
                </p>
              </div>
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Address
              </h3>
              <p className="text-gray-600 flex items-center">
                <FaHome className="text-blue-500 mr-2" />
                {bookDetails?.bookId?.address?.street},{" "}
                {bookDetails?.bookId?.address?.city},{" "}
                {bookDetails?.bookId?.address?.district},{" "}
                {bookDetails?.bookId?.address?.state},{" "}
                {bookDetails?.bookId?.address?.pincode}
              </p>
            </div>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Book Details
              </h3>
              <p className="text-gray-600">
                Book Name: {bookDetails?.bookId?.bookTitle}
              </p>
              <p className="text-gray-600">
                Quantity: {bookDetails?.quantity}
              </p>
              <p className="text-gray-600">
                Rental Price for a Day: {bookDetails?.bookId?.rentalFee}
              </p>
              <p className="text-gray-600">
                Deposit Amount: {bookDetails?.bookId?.extraFee}
              </p>
              <p className="text-gray-600">
                Total Rental Price: {bookDetails?.totalRentalPrice}
              </p>
              <p className="text-gray-600">Total Price: ${totalPrice}</p>
            </div>
            <div className="mt-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-green-600"
                  checked={isAgreed}
                //   onClick={makePayment}
                  onChange={handleAgreeChange}
                />
                <span className="ml-2 text-gray-700">
                  I agree to the terms and conditions.
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-4">
                Please pay within 24 hours. After the time expires, you will not be able to make the payment, and you will need to request the book again. The amount will be credited to our website. When you arrive at the lender's location, such as{" "}
                <strong>
                  Mr. {bookDetails?.receiverId?.name}
                </strong>
                's residence, please inform us. Only then will the amount be credited to the lender. If any issues arise or the book sustains damage, the deposit amount will also be credited to the lender. Ensure the book is safely handled.
              </p>
            </div>
            <button 
            onClick={makePayment}
            disabled={!isAgreed}
            className={`text-center justify-center mt-6 px-6 py-3 ${isAgreed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
          >
            Proceed to Pay
          </button>

          </div>
        </div>
      </div>
      
      );
  };

  export default LenderDetails;
