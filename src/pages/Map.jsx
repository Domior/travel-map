import React, { useState, useEffect, useMemo } from 'react';
import {
  GoogleMap,
  Marker,
  Polyline,
  Autocomplete,
  useLoadScript,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import { v4 as uuid } from 'uuid';

import MarkersInfo from '../components/Dialogs/MarkersInfo';
import ConstructRoute from '../components/Buttons/ConstructRoute';

import {
  MAP_API_KEY,
  MAP_ZOOM,
  MAP_INITIAL_POSITION,
  MAP_MARKERS_LIMIT,
  MARKERS_LIMIT_ALERT,
  ANIMATION_DURATION,
  POLYLINE_STYLES,
  PLANE_ICON_MODEL,
  MARKER_ICON_MODEL,
} from '../constants/google_map';
import { MapService } from '../services/MapService';

import { ReactComponent as ClearIcon } from '../assets/icons/close-dark.svg';

Geocode.setApiKey(MAP_API_KEY);

const libraries = ['places'];

const MapContainer = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
    libraries,
  });

  const [position, setPosition] = useState(MAP_INITIAL_POSITION);
  const [address, setAddress] = useState('');
  const [autoComplete, setAutoComplete] = useState(null);
  const [inputValue, setInputValue] = useState(address);

  const [markers, setMarkers] = useState([]);
  const waypoints = useMemo(
    () => [...markers.map(marker => marker.position)],
    [markers],
  );

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

    void (async () => {
      if (_address === undefined) return;
      setAddress(_address);
      setInputValue(_address);

      const _position = await MapService.getCoordinatesFromAddress(_address);

      setPosition(_position);
      setMarkers(prev => [...prev, { id: uuid(), position: { ..._position } }]);
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
    setPosition(_position);
    setMarkers(prev => [...prev, { id: uuid(), position: { ..._position } }]);

    void (async () => {
      const _address = await MapService.getAddressFromCoordinates(_position);

      setAddress(_address);
      setInputValue(_address);
    })();
  };

  const handleMarkerDblClick = id => {
    setMarkers([...markers.filter(marker => marker.id !== id)]);
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

      const duration = ANIMATION_DURATION;

      const progress = timestamp - animationStartTime;
      const index = currentWaypointIndex;
      const currentWaypoint = waypoints[index];

      if (progress < duration && index < waypoints.length - 1) {
        const nextWaypoint = waypoints[index + 1];

        const deltaX = nextWaypoint.lng - currentWaypoint.lng;
        const deltaY = nextWaypoint.lat - currentWaypoint.lat;
        const factor = progress / duration;

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

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle="h-full w-full"
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
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
              }}
              className="w-[400px] h-9 pr-8 pl-3 border border-transparent rounded truncate"
            />

            <ClearIcon
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setAddress('');
                setInputValue('');
              }}
            />
          </div>
        </Autocomplete>

        {markers.map(({ id, position }) => (
          <Marker
            key={id}
            icon={MARKER_ICON_MODEL}
            position={position}
            onDblClick={() => handleMarkerDblClick(id)}
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

        <ConstructRoute markersCount={markers.length} onClick={startAnimation} />
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
