import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  GoogleMap,
  Marker,
  Polyline,
  Autocomplete,
  useLoadScript,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';

import MarkersInfo from '../components/Dialogs/MarkersInfo';
import PaymentDetails from '../components/Dialogs/PaymentDetails';
import ConstructRoute from '../components/Buttons/ConstructRoute';

import {
  MAP_API_KEY,
  MAP_ZOOM,
  MAP_MARKERS_LIMIT,
  MARKERS_LIMIT_ALERT,
  ANIMATION_DURATION,
  POLYLINE_STYLES,
  PLANE_ICON_MODEL,
  MARKER_ICON_MODEL,
} from '../constants/google_map';
import { MapService } from '../services/MapService';
import { STATUSES } from '../constants/redux';
import { MIN_PRICE } from '../constants/stripe';
import {
  setPosition,
  setAddress,
  setSearchValue,
  setMarkers,
  handleMarkerDblClick,
  clearAutocomplete,
  resetMap,
} from '../redux/slices/mapSlice';
import { resetStripe } from '../redux/slices/stripeSlice';
import { calculateDistance } from '../helpers/map';

import { ReactComponent as ClearIcon } from '../assets/icons/close-dark.svg';

Geocode.setApiKey(MAP_API_KEY);

const libraries = ['places'];

const MapContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
    libraries,
  });

  const { status } = useSelector(state => state.google);
  const { paymentMethod } = useSelector(state => state.stripe);
  const { position, markers, searchValue } = useSelector(state => state.map);

  const waypoints = useMemo(
    () => [...markers.map(marker => marker.position)],
    [markers],
  );

  const [autoComplete, setAutoComplete] = useState(null);

  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(waypoints[0]);
  const [isRouteConstructed, setIsRouteConstructed] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  const [totalDistance, setTotalDistance] = useState();

  const onPlaceChanged = () => {
    if (autoComplete === null) return;
    if (markers.length === MAP_MARKERS_LIMIT) {
      alert(MARKERS_LIMIT_ALERT);
      return;
    }
    const _address = autoComplete.getPlace().formatted_address;

    (async () => {
      if (_address === undefined) return;
      dispatch(setAddress(_address));
      dispatch(setSearchValue(_address));

      const _position = await MapService.getCoordinatesFromAddress(_address);

      dispatch(setPosition(_position));
      dispatch(setMarkers({ _position, _address }));
    })();
  };

  const onMapClick = e => {
    if (e.latLng === null) return;
    if (markers.length === MAP_MARKERS_LIMIT) {
      alert(MARKERS_LIMIT_ALERT);
      return;
    }
    const _position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    dispatch(setPosition(_position));

    (async () => {
      const _address = await MapService.getAddressFromCoordinates(_position);

      dispatch(setAddress(_address));
      dispatch(setSearchValue(_address));
      dispatch(setMarkers({ _position, _address }));
    })();
  };

  const startAnimation = () => setAnimationStarted(true);

  const constructRoute = () => setIsRouteConstructed(true);

  useEffect(() => {
    if (waypoints.length > 2) {
      const totalDistance = waypoints
        .slice(0, -1)
        .reduce((accumulator, waypoint, index) => {
          const { lat: lat1, lng: lon1 } = waypoint;
          const { lat: lat2, lng: lon2 } = waypoints[index + 1];
          const distance = calculateDistance(lat1, lon1, lat2, lon2);
          return accumulator + distance;
        }, 0);
      setTotalDistance(Math.ceil(totalDistance));
    }
  }, [waypoints]);

  useEffect(() => {
    if (markers.length < MAP_MARKERS_LIMIT) return;
    if (!animationStarted) return;

    let animationFrameId;
    let animationStartTime;

    const animateMarker = timestamp => {
      if (!animationStartTime) {
        animationStartTime = timestamp;
      }

      const progress = timestamp - animationStartTime;
      const index = currentWaypointIndex;
      const currentWaypoint = waypoints[index];

      if (progress < ANIMATION_DURATION && index < waypoints.length - 1) {
        const nextWaypoint = waypoints[index + 1];

        const deltaX = nextWaypoint.lng - currentWaypoint.lng;
        const deltaY = nextWaypoint.lat - currentWaypoint.lat;
        const factor = progress / ANIMATION_DURATION;

        setMarkerPosition({
          lat: currentWaypoint.lat + deltaY * factor,
          lng: currentWaypoint.lng + deltaX * factor,
        });

        animationFrameId = window.requestAnimationFrame(animateMarker);
      } else {
        setMarkerPosition(currentWaypoint);
        setCurrentWaypointIndex(prevIndex => prevIndex + 1);
      }
    };

    if (animationStarted && currentWaypointIndex < waypoints.length - 1) {
      animationFrameId = window.requestAnimationFrame(animateMarker);
    }

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentWaypointIndex, waypoints, markers.length, animationStarted]);

  useEffect(() => {
    if (waypoints.length !== 1 && currentWaypointIndex === waypoints.length - 1) {
      alert('Your flight successfully completed. Let`s go to have a new one?');
      setAnimationStarted(false);
      setIsRouteConstructed(false);
      dispatch(resetMap());
      dispatch(resetStripe());
    }
  }, [dispatch, navigate, currentWaypointIndex, waypoints.length]);

  useEffect(() => {
    if (paymentMethod === null) {
      navigate('/stripe');
    }
  }, [paymentMethod, navigate]);

  useEffect(() => {
    if (status !== STATUSES.SUCCESS) {
      navigate('/login');
    }
  }, [status, navigate]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerClassName="h-full w-full"
        zoom={MAP_ZOOM}
        center={position}
        onClick={onMapClick}
      >
        <MarkersInfo markersCount={markers.length} />
        <Autocomplete
          onLoad={autocomplete => {
            setAutoComplete(autocomplete);
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <div className="w-fit relative top-3 left-1/2 -translate-x-1/2">
            <input
              type="text"
              placeholder="Enter address"
              value={searchValue}
              onChange={e => {
                dispatch(setSearchValue(e.target.value));
              }}
              className="w-[400px] h-9 pr-8 pl-3 border border-transparent rounded truncate"
            />

            <ClearIcon
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => dispatch(clearAutocomplete())}
            />
          </div>
        </Autocomplete>

        {markers.map(({ id, position }) => (
          <Marker
            key={id}
            icon={MARKER_ICON_MODEL}
            position={position}
            onDblClick={() => {
              dispatch(handleMarkerDblClick(id));
              setIsRouteConstructed(false);
            }}
          />
        ))}

        {isRouteConstructed && (
          <Polyline path={waypoints} options={POLYLINE_STYLES} />
        )}

        {waypoints.length >= MAP_MARKERS_LIMIT &&
          animationStarted &&
          currentWaypointIndex < waypoints.length - 1 && (
            <Marker
              position={markerPosition}
              animation={window.google.maps.Animation.DROP}
              icon={PLANE_ICON_MODEL}
            />
          )}
        <PaymentDetails
          amount={totalDistance > MIN_PRICE ? totalDistance : MIN_PRICE}
          markersCount={markers.length}
          isRouteConstructed={isRouteConstructed}
          onStartAnimation={startAnimation}
        />
        <ConstructRoute
          onClick={constructRoute}
          disabled={animationStarted || markers.length !== MAP_MARKERS_LIMIT}
        />
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
