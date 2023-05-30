import React from 'react';
import { useSelector } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';

import { MAP_MARKERS_LIMIT } from '../../constants/google_map';
import { StripeService } from '../../services/StripeService';

const PaymentDetails = ({ amount, markersCount }) => {
  const stripe = useStripe();

  const { profile } = useSelector(state => state.google);
  const { paymentMethod } = useSelector(state => state.stripe);
  const { markers } = useSelector(state => state.map);

  const handlePayClick = async () => {
    if (!stripe) return;

    try {
      const { id: paymentMethodId } = paymentMethod;
      const response = await StripeService.pay({
        amount,
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
    markersCount === MAP_MARKERS_LIMIT && (
      <div className="fixed max-w-md top-16 right-3 p-5 bg-white border rounded-lg ">
        <div className="mb-4">
          <p className="truncate">
            <span className="italic">From:</span> {markers[0]?.address}
          </p>
          <p className="truncate">
            {' '}
            <span className="italic">To:</span>{' '}
            {markers[markers.length - 1]?.address}
          </p>
        </div>
        <div className="mb-3">
          <img className="mb-2 rounded-md" src={profile.picture} alt="user_image" />
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </div>
        <div className="mb-5">
          <p>
            Ticket price: <span className="text-lg font-medium">${amount}</span>
          </p>
        </div>
        <button
          className="btn-base h-9 bg-green-600"
          onClick={handlePayClick}
          disabled={!stripe}
        >
          Pay
        </button>
      </div>
    )
  );
};

export default PaymentDetails;
