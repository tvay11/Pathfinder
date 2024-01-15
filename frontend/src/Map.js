import React, {useEffect, useMemo, useRef} from "react";
import {GoogleMap, Marker} from "@react-google-maps/api";

export function Map({start, end, waypoints}) {
    const mapRef = useRef(null);
    const center = useMemo(() => ({lat: 38.6270, lng: -90.1994}), []);

    useEffect(() => {
        if (mapRef.current && start) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(start);

            if (end) {
                bounds.extend(end);
            }

            waypoints.forEach(waypoint => {
                if (waypoint) {
                    bounds.extend(new window.google.maps.LatLng(waypoint.lat, waypoint.lng));
                }
            });

            mapRef.current.fitBounds(bounds);
        }
    }, [start, end, waypoints]);

    return (
        <div style={{width: '100%', height: '95%', overflow: 'scroll', position: 'relative'}}>
            <div style={{height: '100%', transform: 'translateY(5%)'}}>
                <GoogleMap
                    ref={mapRef}
                    zoom={10}
                    center={center}
                    mapContainerStyle={{width: '100%', height: '100%'}}
                    onLoad={map => mapRef.current = map}
                >
                    {start && <Marker position={start}/>}
                    {end && <Marker position={end}/>}
                    {waypoints.map((waypoint, index) => (
                        waypoint && <Marker key={index} position={waypoint}/>
                    ))}
                </GoogleMap>
            </div>
        </div>
    );
}