import React from 'react';

import { MAP_MARKERS_LIMIT } from '../../constants/google_map';

const MarkersInfo = ({ markersCount }) => {
  return (
    markersCount < MAP_MARKERS_LIMIT && (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 p-6 bg-white rounded-xl text-red-600">
        Your have to choose {MAP_MARKERS_LIMIT - markersCount} place
        {markersCount !== MAP_MARKERS_LIMIT - 1 ? 's' : ''} more to continue
      </div>
    )
  );
};

export default MarkersInfo;
