import planeIcon from '../assets/airplane.png';
import markerIcon from '../assets/marker.png';

export const MAP_INITIAL_POSITION = {
  lat: 48.448509,
  lng: 35.026279,
};

export const MAP_ZOOM = 15;

export const MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '';

export const MAP_MARKERS_LIMIT = 3;

export const MARKERS_LIMIT_ALERT = `You reached the limit of ${MAP_MARKERS_LIMIT} places. If you want to select new one, double tap on the existing marker to remove it`;

export const ANIMATION_DURATION = 5000; // Animation duration in milliseconds

export const POLYLINE_STYLES = {
  strokeColor: '#b103fc',
  strokeOpacity: 0.8,
  strokeWeight: 4,
};

export const PLANE_ICON_MODEL = {
  url: planeIcon,
  scaledSize: { width: 50, height: 50 },
  origin: { x: 0, y: 0 },
};

export const MARKER_ICON_MODEL = {
  url: markerIcon,
  scaledSize: { width: 40, height: 40 },
  origin: { x: 0, y: 0 },
};
