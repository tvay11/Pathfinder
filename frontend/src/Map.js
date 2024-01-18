import React, {useEffect, useMemo, useRef} from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

export function Map({ start, end, waypoints }) {
    const mapRef = useRef(null);
    const center = useMemo(() => ({lat: 38.6270, lng: -90.1994}), []);
    const directionsServiceRef = useRef(new window.google.maps.DirectionsService());
    const directionsRendererRef = useRef(new window.google.maps.DirectionsRenderer());
    const waypointsRef = waypoints.map(waypoint => ({ location: waypoint, stopover: true }));

    useEffect(() => {
        if (mapRef.current && start && end) {
            directionsServiceRef.current.route({
                origin: start,
                destination: end,
                waypoints: waypointsRef,
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRendererRef.current.setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }, [start, end, waypoints]);

    useEffect(() => {
        if (mapRef.current) {
            directionsRendererRef.current.setMap(mapRef.current);
        }
    }, []);

    return (
        <GoogleMap
            ref={mapRef}
            zoom={10}
            center={center}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={map => {
                mapRef.current = map;
                directionsRendererRef.current.setMap(map);
            }}
        >
            {start && <Marker position={start} />}
            {end && <Marker position={end} />}
        </GoogleMap>
    );
}
