import React from "react";
import { Box, Heading, IconButton, Button } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionButton = motion(Button);
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
    const MotionIconButton = motion(IconButton);

    return (
        <Box width={{ base: '100%', md: '20%' }} padding="1rem" >
            <Heading as="h3" size="lg" mb="1.5vh">Pathfinder</Heading>
            <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
            <PlacesAutocomplete onSelect={setStart} label="Starting Location" />
            </MotionDiv>
            {waypoints.map((waypoint, index) => (
                <MotionDiv
                    key={waypoint.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
                >
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
                    <MotionIconButton
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Delete waypoint"
                        icon={<DeleteIcon />}
                        onClick={() => removeWaypoint(waypoint.id)}
                        size="sm"
                        colorScheme="red"
                    />
                </div>
                </MotionDiv>
            ))}
            {!isRoundTrip && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                    <div style={{ flexGrow: 1, marginRight: '10px' }}>
                        <PlacesAutocomplete onSelect={setEnd} label="Ending Location" />
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <MotionIconButton
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
            <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                mt="10px"
                width="100%"
                colorScheme="blue"
                onClick={makeRoute}
            >
                Make Route
            </MotionButton>
        </Box>
    );
};

export default RoutePlannerForm;
