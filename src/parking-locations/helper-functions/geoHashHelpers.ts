import ngeohash from 'ngeohash';
import { AugmentedParkingLocationData } from '../types';

const geohashPrecision = 5;

const geohashPoint = (lat: number, lng: number) => ngeohash.encode(lat, lng, geohashPrecision);

const getUserGeohashAndNeighbors = (userLatLong: google.maps.LatLng, precision: number): string[] => {
    const userGeohash = ngeohash.encode(userLatLong.lat(), userLatLong.lng(), precision);
    const neighbors = ngeohash.neighbors(userGeohash);
    neighbors.push(userGeohash);
    const userGeohashAndNeighbors = neighbors;
    return userGeohashAndNeighbors;
};

const filterLocationsByGeohash = (userGeohashAndNeighbors: string[], parkingLocations: AugmentedParkingLocationData[], precision: number): AugmentedParkingLocationData[] => {
    return parkingLocations.filter(location => {
        const locationGeohash = ngeohash.encode(location.path[0].lat, location.path[0].lng, precision);
        return userGeohashAndNeighbors.includes(locationGeohash);
    });
};


const mapLocationsToDistances = (userLatLong: google.maps.LatLng, parkingLocations: AugmentedParkingLocationData[]): { location: AugmentedParkingLocationData, point: google.maps.LatLng, distance: number }[] => {
    return parkingLocations.flatMap(location =>
        location.path.map(point => ({
            location,
            point: new google.maps.LatLng(point.lat, point.lng),
            distance: calculateDistance(userLatLong, new google.maps.LatLng(point.lat, point.lng))
        }))
    );
};

const calculateDistance = (userLatLong: google.maps.LatLng, point: google.maps.LatLng) => {
    return google.maps.geometry.spherical.computeDistanceBetween(userLatLong, point);
};

const sortByDistance = (a: { distance: number }, b: { distance: number }): number => a.distance - b.distance;


export { geohashPrecision, calculateDistance, geohashPoint, filterLocationsByGeohash, mapLocationsToDistances, getUserGeohashAndNeighbors, sortByDistance }