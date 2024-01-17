import React, {useState} from "react";
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    IconButton,
    ScaleFade,
    SlideFade,
    useBreakpointValue
} from "@chakra-ui/react";
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {RouteDisplay} from "./RouteDisplay";
import {Map} from "./Map";
import {useNavigate} from 'react-router-dom';
import {PlacesAutocomplete} from "./PlacesAutocomplete";
import './App.css';
import RoutePlannerForm from "./RoutePlanner";

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

    const layoutDirection = useBreakpointValue({ base: 'column', md: 'row' });
    const resultDisplayWidth = useBreakpointValue({ base: '100%', md: '50%' });

    return (
        <Flex direction={layoutDirection} height="100vh">
            <RoutePlannerForm
                start={start}
                setStart={setStart}
                end={end}
                setEnd={setEnd}
                waypoints={waypoints}
                setWaypoints={setWaypoints}
                isRoundTrip={isRoundTrip}
                setIsRoundTrip={setIsRoundTrip}
                makeRoute={makeRoute}
            />

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

        </Flex>
    );
}

