import React, {useState} from "react";
import {Box, Button, Heading, IconButton, Input, List, ListItem} from "@chakra-ui/react";
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import RouteDisplay from "./RouteDisplay";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {Map} from "./Map";
import { useNavigate } from 'react-router-dom';
export function Places() {
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
                    navigate('/Result', { state: { routeData: data } });
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
                <Heading as="h3" size="lg" style={{paddingLeft:'0.5vw'}}>Pathfinder</Heading>
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

                    {/* Round Trip checkbox */}
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
                <RouteDisplay routeData={routeData}/>
            </div>

            <div style={{flexGrow: 1}}>
                <Map start={start} end={isRoundTrip ? start : end} waypoints={waypoints.map(wp => wp.location)}/>


            </div>
        </div>
    );
}

function PlacesAutocomplete({onSelect, label}) {
    const {
        ready,
        value,
        suggestions: {status, data},
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {lat: () => 43.45, lng: () => -80.49},
            radius: 200 * 1000,
        },
    });

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({address});
            const {lat, lng} = await getLatLng(results[0]);
            onSelect({lat, lng});
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return (
        <Box position="relative">
            <Input style={{width: '100%'}}
                   value={value}
                   onChange={handleInput}
                   disabled={!ready}
                   placeholder={label}
                   size="md"
            />
            {status === "OK" && (
                <List position="absolute" width="full" bg="white" maxHeight="300px" overflowY="auto" zIndex="1000"
                      boxShadow="md">
                    {data.map(({place_id, description}) => (
                        <ListItem key={place_id} paddingX="4" paddingY="2" cursor="pointer" _hover={{bg: "gray.100"}}
                                  onClick={() => handleSelect(description)}>
                            {description}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}