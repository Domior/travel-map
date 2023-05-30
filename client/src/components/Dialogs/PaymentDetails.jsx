import React from 'react';
import { useSelector } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';

import { StripeService } from '../../services/StripeService';

const PaymentDetails = () => {
  const stripe = useStripe();

  const { profile } = useSelector(state => state.google);
  const { paymentMethod } = useSelector(state => state.stripe);

  const handlePayClick = async () => {
    if (!stripe) return;

    try {
      const { id: paymentMethodId } = paymentMethod;
      const response = await StripeService.pay({
        amount: 1000,
        paymentMethodId,
      });

      console.log('[PaymentMethod]', paymentMethod);
      console.log('[Response]', response);

      const result = await stripe.confirmCardPayment(response.data.clientSecret);

      if (result.error) {
        alert('payment error');
      } else {
        alert('payment success');
        console.log('result', result);
      }
    } catch (err) {
      console.log('[Error]', err);
    }
  };

  return (
    <div className="fixed top-60 right-12 p-6 bg-white rounded-lg">
      <div>
        <img src={profile.picture} alt="user_image" />
        <p>Name: {profile.name}</p>
        <p>Email Address: {profile.email}</p>
      </div>
      <button onClick={handlePayClick}>Pay</button>
    </div>
  );
};

export default PaymentDetails;
