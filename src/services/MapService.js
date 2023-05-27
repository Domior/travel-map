import Geocode from 'react-geocode';

export class MapService {
  static async getAddressFromCoordinates(position) {
    const { results, status } = await Geocode.fromLatLng(
      position.lat.toString(),
      position.lng.toString(),
    );

    if (status !== window.google.maps.GeocoderStatus.OK) return;

    const _address = results[0].formatted_address;

    return _address;
  }

  static async getCoordinatesFromAddress(address) {
    const { results, status } = await Geocode.fromAddress(address);

    if (status !== window.google.maps.GeocoderStatus.OK) throw new Error(status);

    return results[0].geometry.location;
  }
}
