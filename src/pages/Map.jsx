import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  Autocomplete,
  useLoadScript,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';

import { MAPS_API_KEY, MAP_ZOOM, initialMapPosition } from '../constants/google_map';

// import { ReactComponent as ClearIcon } from '../../assets/icons/close-dark.svg';

Geocode.setApiKey(MAPS_API_KEY);

const libraries = ['places'];

const MapContainer = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAPS_API_KEY,
    libraries,
  });

  // const [autoComplete, setAutoComplete] = useState(null);
  // const [inputValue, setInputValue] = useState(address);

  const { lat, lng } = initialMapPosition;

  const mapOptions = {
    center: { lat: lat, lng: lng },
    zoom: MAP_ZOOM,
  };

  const markers = [
    {
      lat: 48.458509,
      lng: 35.026279,
    },
    {
      lat: 48.468509,
      lng: 35.026279,
    },
    {
      lat: 48.478509,
      lng: 35.026279,
    },
  ];

  const directionsOptions = {
    origin: markers[0],
    waypoints: markers.slice(1, -1),
    destination: markers[markers.length - 1],
    travelMode: 'WALKING',
  };

  const directionsCallback = response => {
    if (response !== null && response.status === 'OK') {
      console.log('Directions response:', response);
    }
  };

  // const onPlaceChanged = () => {
  //   if (autoComplete === null) return;
  //   const _address = autoComplete.getPlace().formatted_address;

  //   void (async () => {
  //     if (_address === undefined) return;
  //     onSetAddress(_address);
  //     setInputValue(_address);

  //     const _position = await MapService.getCoordinatesFromAddress(_address);

  //     onSetPosition(_position);
  //   })();
  // };

  // const onMapClick = e => {
  //   if (e.latLng === null) return;
  //   const _position = {
  //     lat: e.latLng.lat(),
  //     lng: e.latLng.lng(),
  //   };
  //   onSetPosition(_position);

  //   void (async () => {
  //     const _address = await MapService.getAddressFromCoordinates(_position);

  //     onSetAddress(_address);
  //     setInputValue(_address);
  //   })();
  // };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        zoom={mapOptions.zoom}
        center={mapOptions.center}
        // onClick={onMapClick}
      >
        {/* <Autocomplete
          onLoad={autocomplete => {
            setAutoComplete(autocomplete);
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <div className="map__input-container">
            <input
              type="text"
              placeholder="Enter address"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
              }}
              className="map__input"
            />
            <ClearIcon
              className="map__input__clear"
              onClick={() => {
                onSetAddress('');
                setInputValue('');
              }}
            />
          </div>
        </Autocomplete> */}

        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}

        <DirectionsService
          options={directionsOptions}
          callback={directionsCallback}
        />
        <DirectionsRenderer />
      </GoogleMap>
    </div>
  );
};

export default MapContainer;
