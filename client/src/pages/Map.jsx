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
import {
  setPosition,
  setAddress,
  setSearchValue,
  setMarkers,
  handleMarkerDblClick,
  clear,
} from '../redux/slices/mapSlice';

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
  const { position, markers, searchValue } = useSelector(state => state.map);

  const waypoints = useMemo(
    () => [...markers.map(marker => marker.position)],
    [markers],
  );

  const [autoComplete, setAutoComplete] = useState(null);

  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(waypoints[0]);
  const [animationStarted, setAnimationStarted] = useState(false);

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
      dispatch(setMarkers(_position));
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
    dispatch(setMarkers(_position));

    (async () => {
      const _address = await MapService.getAddressFromCoordinates(_position);

      dispatch(setAddress(_address));
      dispatch(setSearchValue(_address));
    })();
  };

  const startAnimation = () => {
    setAnimationStarted(true);
  };

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
              onClick={() => dispatch(clear())}
            />
          </div>
        </Autocomplete>

        {markers.map(({ id, position }) => (
          <Marker
            key={id}
            icon={MARKER_ICON_MODEL}
            position={position}
            onDblClick={() => dispatch(handleMarkerDblClick(id))}
          />
        ))}

        {waypoints.length >= MAP_MARKERS_LIMIT && (
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
        <PaymentDetails />
        <ConstructRoute markersCount={markers.length} onClick={startAnimation} />
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
