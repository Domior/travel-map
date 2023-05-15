import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [cardElement, setCardElement] = useState(null);
  const [error, setError] = useState(null);

  const handleCardElementChange = event => {
    setCardElement(event.complete ? event.element : null);
    setError(event.error ? event.error.message : null);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      console.log('[error]', error);
    } else {
      setError(null);
      console.log('[PaymentMethod]', paymentMethod);
      navigate('/map');
      // Send paymentMethod.id to your server to save the card details
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit}>
        <label htmlFor="card-element" className="text-xl">
          Enter your credit or debit card details for future payments
        </label>
        <div id="card-element" className="mt-2 max-h-96">
          <CardElement
            options={{ style: { base: { fontSize: '16px' } } }}
            onChange={handleCardElementChange}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={!stripe}
          className="mt-5 btn-base max-w-none"
        >
          Save card
        </button>
      </form>
    </div>
  );
}

const Stripe = () => {
  return (
    <Elements stripe={stripe}>
      <CheckoutForm />
    </Elements>
  );
};

export default Stripe;
