import React from 'react';

import { MAP_MARKERS_LIMIT } from '../../constants/google_map';

const ConstructRoute = ({ markersCount, onClick }) => {
  return (
    <button
      type="button"
      className="btn-base fixed bottom-5 left-1/2 -translate-x-1/2"
      disabled={markersCount !== MAP_MARKERS_LIMIT}
      onClick={onClick}
    >
      Construct route
    </button>
  );
};

export default ConstructRoute;
