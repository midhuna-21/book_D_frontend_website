import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Payment = ({ totalPrice }: { totalPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('[error]', error);
      } else {
        console.log('[PaymentMethod]', paymentMethod);

        // Call your backend to create the PaymentIntent
        const response = await fetch('/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalPrice * 100 }), // Stripe expects the amount in cents
        });

        const paymentIntent = await response.json();

        const { error: confirmError } = await stripe.confirmCardPayment(paymentIntent.clientSecret);

        if (confirmError) {
          console.error('[confirmError]', confirmError);
        } else {
          alert('Payment successful!');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Payment Details</h3>
      <CardElement className="p-4 border rounded-md" />
      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md font-semibold mt-4"
      >
        Pay ${totalPrice}
      </button>
    </form>
  );
};

export default Payment;
