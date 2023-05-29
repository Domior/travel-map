import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

import { StripeService } from '../services/StripeService';

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

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id: paymentMethodId } = paymentMethod;
        const response = await StripeService.pay({
          amount: 1000,
          paymentMethodId,
        });

        setError(null);
        console.log('[PaymentMethod]', paymentMethod);
        console.log('[Response]', response);

        const result = await stripe.confirmCardPayment(
          response.data.clientSecret,
          cardElement,
        );

        if (result.error) {
          alert('payment error');
        } else {
          alert('payment success');
          console.log('result', result);
        }

        navigate('/map');
      } catch (error) {
        setError(error.message);
        console.log('[Error]', error);
      }
    } else {
      toast.error(error.message);
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
