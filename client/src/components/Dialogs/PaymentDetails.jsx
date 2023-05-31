import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

import Loader from '../Loader';

import { MAP_MARKERS_LIMIT } from '../../constants/google_map';
import { StripeService } from '../../services/StripeService';

const PaymentDetails = ({
  amount,
  markersCount,
  isRouteConstructed,
  onStartAnimation,
}) => {
  const stripe = useStripe();

  const { profile } = useSelector(state => state.google);
  const { paymentMethod } = useSelector(state => state.stripe);
  const { markers } = useSelector(state => state.map);

  const [isLoading, setIsLoading] = useState(false);

  const handlePayClick = async () => {
    if (!stripe) return;

    try {
      setIsLoading(true);
      const { id: paymentMethodId } = paymentMethod;
      const {
        data: { clientSecret },
      } = await StripeService.pay({
        amount,
        paymentMethodId,
      });

      const { error } = await stripe.confirmCardPayment(clientSecret);

      if (error) {
        toast.error('Something went wrong while processing the payment');
      } else {
        onStartAnimation();
        toast.success('Payment was successful. Happy flight.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isRouteConstructed &&
    markersCount === MAP_MARKERS_LIMIT && (
      <div className="fixed max-w-md top-16 right-3 p-5 bg-white border rounded-lg ">
        <div className="mb-4">
          <p className="mb-1 text-lg font-medium">Directions:</p>
          <p className="truncate">
            <span className="italic">From:</span> {markers[0]?.address}
          </p>
          <p className="truncate">
            <span className="italic">To:</span> {markers[markersCount - 1]?.address}
          </p>
        </div>
        <div className="mb-3">
          <p className="mb-1 text-lg font-medium">Person information</p>
          <div className="flex">
            <img
              className="mb-2 me-3 rounded-md"
              src={profile.picture}
              alt="user_image"
            />
            <div>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
            </div>
          </div>
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
          {!isLoading ? 'Pay' : <Loader />}
        </button>
      </div>
    )
  );
};

export default PaymentDetails;
