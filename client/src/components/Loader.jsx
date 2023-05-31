import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loader = ({ width = 20 }) => {
  return (
    <RotatingLines
      strokeColor="white"
      strokeWidth="5"
      animationDuration="0.75"
      width={width}
      visible={true}
    />
  );
};

export default Loader;
