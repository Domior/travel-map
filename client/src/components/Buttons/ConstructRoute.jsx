import React from 'react';

const ConstructRoute = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      className="btn-base fixed bottom-5 left-1/2 -translate-x-1/2"
      disabled={disabled}
      onClick={onClick}
    >
      Construct route
    </button>
  );
};

export default ConstructRoute;
