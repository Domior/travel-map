import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripeWrapper = ({ children }) => {
  return <Elements stripe={stripe}>{children}</Elements>;
};

export default StripeWrapper;
