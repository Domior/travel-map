import React from 'react';
import { useSelector } from 'react-redux';

const PaymentDetails = () => {
  const { profile } = useSelector(state => state.google);

  return (
    <div className="fixed top-60 right-12 p-6 bg-white rounded-lg">
      <div>
        <img src={profile.picture} alt="user_image" />
        <p>Name: {profile.name}</p>
        <p>Email Address: {profile.email}</p>
      </div>
    </div>
  );
};

export default PaymentDetails;
