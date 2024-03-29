import React, {useState} from "react";
import {
    Box, Divider,
    Flex,
    SlideFade, useBreakpointValue,
} from "@chakra-ui/react";
import {RouteDisplay} from "./RouteDisplay";
import {Map} from "./Map";
import './App.css';
import RoutePlannerForm from "./RoutePlannerForm";

export function HomePage() {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [routeData, setRouteData] = useState(null);
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
    const dividerOrientation = useBreakpointValue({ base: 'horizontal', md: 'vertical' });

    return (
        <Flex direction={layoutDirection} height="100vh"  overflowY="auto">
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
                order={{ base: 1, md: 1 }}
            />
            <Divider orientation={dividerOrientation} borderColor="gray.300" />

            {searchPerformed && (

                <SlideFade in={searchPerformed} offsetX={{ base: 0, md: -30 }} style={{ order: 2 }}>
                    <Box padding="1rem" width="100%" height={{ base: 'auto', md: '100%' }} overflowY="auto">
                        <RouteDisplay routeData={routeData} />
                    </Box>
                </SlideFade>
            )}

            <Box
                width={{ base: '100%', md: searchPerformed ? '55%' : '85%' }}
                height="95%"
                order={{ base: 2, md: 2 }}
                style={{
                    transition: 'all 0.5s ease-in-out',
                    position: 'relative',
                    top: '2.5%',
                    left: searchPerformed ? '-1%' : '0%',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Box height="100%"
                     shadow = "xl"
                     bg="white"
                     rounded ="md"
                >
                <Map start={start} end={isRoundTrip ? start : end} waypoints={waypoints.map(wp => wp.location)} />
                </Box>
            </Box>

        </Flex>
    );
}

