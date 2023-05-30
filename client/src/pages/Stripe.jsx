import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

import { setPaymentMethod } from '../redux/slices/stripeSlice';
import { inputOptions } from '../constants/stripe';
import { STATUSES } from '../constants/redux';

const Stripe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const { status } = useSelector(state => state.google);

  const [inputError, setInputError] = useState(null);

  const handleCardElementChange = event => {
    setInputError(event.error ? event.error.message : null);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      dispatch(setPaymentMethod(paymentMethod));

      navigate('/map');
      toast.success('Card successfully saved');
    } else {
      toast.error(error.message);
    }
  };

  if (status !== STATUSES.SUCCESS) {
    <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit}>
        <label htmlFor="card-element" className="text-xl">
          Enter your credit or debit card details for future payments
        </label>
        <div id="card-element" className="mt-2 max-h-96">
          <CardElement options={inputOptions} onChange={handleCardElementChange} />
        </div>
        {inputError && <p className="mt-1 text-xs text-red-600">{inputError}</p>}
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
};

export default Stripe;
