import React, {useState} from "react";
import {Box, Button, Divider, Heading, IconButton, ScaleFade, SlideFade} from "@chakra-ui/react";
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {RouteDisplay} from "./RouteDisplay";
import {Map} from "./Map";
import {useNavigate} from 'react-router-dom';
import {PlacesAutocomplete} from "./PlacesAutocomplete";
import './App.css';

export function HomePage() {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [routeData, setRouteData] = useState(null);
    const addWaypoint = () => {
        setWaypoints([...waypoints, {id: Date.now(), location: null}]);
    };

    const removeWaypoint = (id) => {
        setWaypoints(waypoints.filter(waypoint => waypoint.id !== id));
    };
    const navigate = useNavigate();
    const [searchPerformed, setSearchPerformed] = useState(false);

    const makeRoute = () => {
        console.log('Start Location:', start);
        console.log('Waypoints:', waypoints);

        if (start && (isRoundTrip || end)) {
            if (isRoundTrip && (!waypoints || waypoints.length === 0)) {
                console.log('For a round trip, please add at least one waypoint.');
                return;
            }

            const origin = `${start.lat},${start.lng}`;
            let queryStringParams = {
                origin: origin,
                destination: isRoundTrip ? origin : `${end.lat},${end.lng}`,
            };

            if (waypoints && waypoints.length > 0) {
                const waypointsParam = waypoints.map(wp => `${wp.location.lat},${wp.location.lng}`).join('|');
                queryStringParams.waypoints = `${waypointsParam}`;
            }

            const queryString = new URLSearchParams(queryStringParams).toString();
            console.log(queryString);

            const routeType = isRoundTrip ? 'roundtrip' : 'oneway';


            fetch(`http://localhost:8080/api/directions/${routeType}?${queryString}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Route data:', data);
                    setRouteData(data);
                    setSearchPerformed(true);
                })
                .catch(error => {
                    console.error('Error fetching route:', error);
                });
        } else {
            console.log('Please enter a start and, if it\'s a one-way trip, an end location.');
        }
    };

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div style={{width: '18%', padding: '1rem'}}>
                <Heading as="h3" size="lg" style={{paddingLeft:'0.5vw', paddingBottom:'1.5vh'}}>Pathfinder</Heading>
                <PlacesAutocomplete onSelect={setStart} label="Starting Location"/>

                {waypoints.map((waypoint, index) => (
                    <div key={waypoint.id}
                         style={{display: 'flex', alignItems: 'center', marginTop: '10px', width: '100%'}}>
                        <div style={{flexGrow: 1, marginRight: '10px'}}>
                            <PlacesAutocomplete
                                onSelect={(location) => {
                                    const updatedWaypoints = waypoints.map((wp) =>
                                        wp.id === waypoint.id ? {...wp, location} : wp
                                    );
                                    setWaypoints(updatedWaypoints);
                                }}
                                label={`Waypoint ${index + 1}`}
                            />
                        </div>
                        <IconButton
                            aria-label="Delete waypoint"
                            icon={<DeleteIcon/>}
                            onClick={() => removeWaypoint(waypoint.id)}
                            size="sm"
                            colorScheme="red"
                        />
                    </div>
                ))}
                <div style={{marginTop: '10px'}}>
                    {!isRoundTrip && <PlacesAutocomplete onSelect={setEnd} label="Ending Location"/>}

                </div>
                <div
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px'}}>
                    <IconButton
                        aria-label="Add waypoint"
                        icon={<AddIcon/>}
                        onClick={addWaypoint}
                        size="sm"
                        colorScheme="teal"
                    />

                    <label style={{display: 'flex', alignItems: 'center'}}>
                        <input
                            type="checkbox"
                            checked={isRoundTrip}
                            onChange={(e) => setIsRoundTrip(e.target.checked)}
                            style={{marginRight: '8px'}}
                        />
                        Round Trip
                    </label>
                </div>
                <Button
                    style={{marginTop: '10px'}}
                    width="100%"
                    colorScheme="blue"
                    onClick={makeRoute}
                >
                    Make Route
                </Button>
            </div>

            <Divider orientation="vertical" />

            <div style={{ display: 'flex', flexGrow: 1, transition: 'width 0.5s' }}>
                {searchPerformed && (
                    <SlideFade in={searchPerformed} offsetX={-30} style={{ width: '50%', overflowY: 'auto' }}>
                        <div style={{ padding: '1rem' }}>
                            <RouteDisplay routeData={routeData} />
                        </div>
                    </SlideFade>
                )}

                <Divider orientation="vertical" />

                <Box
                    width={searchPerformed ? '95%' : '100%'}
                    height="100%"
                    pl={searchPerformed ? '1rem' : '1rem'}
                    rounded='md'>
                    <Box
                        height="100%"
                        shadow="xl"
                        bg="white"
                        rounded='md'>
                        <Map start={start} end={isRoundTrip ? start : end} waypoints={waypoints.map(wp => wp.location)} />
                    </Box>
                </Box>


            </div>

        </div>
    );
}

