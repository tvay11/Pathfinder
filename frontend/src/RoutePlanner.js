import React from "react";
import { Box, Heading, IconButton, Button } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { PlacesAutocomplete } from "./PlacesAutocomplete";

const RoutePlannerForm = ({
                              start,
                              setStart,
                              end,
                              setEnd,
                              waypoints,
                              setWaypoints,
                              isRoundTrip,
                              setIsRoundTrip,
                              makeRoute
                          }) => {
    const removeWaypoint = (id) => {
        setWaypoints(waypoints.filter(waypoint => waypoint.id !== id));
    };

    const addWaypoint = () => {
        setWaypoints([...waypoints, { id: Date.now(), location: null }]);
    };

    return (
        <Box width={{ base: '100%', md: '18%' }} padding="1rem">
            <Heading as="h3" size="lg" mb="1.5vh">Pathfinder</Heading>
            <PlacesAutocomplete onSelect={setStart} label="Starting Location" />
            {waypoints.map((waypoint, index) => (
                <div key={waypoint.id} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ flexGrow: 1, marginRight: '10px' }}>
                        <PlacesAutocomplete
                            onSelect={(location) => {
                                const updatedWaypoints = waypoints.map((wp) =>
                                    wp.id === waypoint.id ? { ...wp, location } : wp
                                );
                                setWaypoints(updatedWaypoints);
                            }}
                            label={`Waypoint ${index + 1}`}
                        />
                    </div>
                    <IconButton
                        aria-label="Delete waypoint"
                        icon={<DeleteIcon />}
                        onClick={() => removeWaypoint(waypoint.id)}
                        size="sm"
                        colorScheme="red"
                    />
                </div>
            ))}
            {!isRoundTrip && (
                <PlacesAutocomplete onSelect={setEnd} label="Ending Location" />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <IconButton
                    aria-label="Add waypoint"
                    icon={<AddIcon />}
                    onClick={addWaypoint}
                    size="sm"
                    colorScheme="teal"
                />
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={isRoundTrip}
                        onChange={(e) => setIsRoundTrip(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Round Trip
                </label>
            </div>
            <Button
                mt="10px"
                width="100%"
                colorScheme="blue"
                onClick={makeRoute}
            >
                Make Route
            </Button>
        </Box>
    );
};

export default RoutePlannerForm;
