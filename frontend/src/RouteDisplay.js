import React, { useMemo } from 'react';
import { Box, Text, VStack, Divider, Heading, Container, Badge, Button } from '@chakra-ui/react';

export function RouteDisplay({ routeData }) {
    const googleMapsLink = useMemo(() => {
        if (!routeData || !routeData.legs) {
            return null;
        }

        const origin = routeData.legs[0].startAddress;
        const destination = routeData.legs[routeData.legs.length - 1].endAddress;
        const waypoints = routeData.legs.slice(1, -1).map(leg => leg.startAddress).join('|');

        const baseUrl = 'https://www.google.com/maps/dir/?api=1';
        const urlParams = new URLSearchParams({
            origin: origin,
            destination: destination,
            waypoints: waypoints
        });

        return `${baseUrl}&${urlParams.toString()}`;
    }, [routeData]);

    const openGoogleMaps = () => {
        if (googleMapsLink) {
            window.open(googleMapsLink, '_blank');
        }
    };

    if (!routeData || !routeData.legs) {
        return <Text>No route data available.</Text>;
    }

    return (
        <Container maxW="container.md" p={4}>
            <Box bg="gray.50" boxShadow="xl" rounded="md" p={4} overflowY="auto">
                <VStack spacing={3} align="stretch">
                    <Heading as="h3" size="lg" mb={4}>Route Details</Heading>
                    {routeData.legs.map((leg, index) => (
                        <Box key={index} bg="gray.50" p={4} shadow="md" borderWidth="1px" borderRadius="md">
                            <Badge colorScheme="blue" mb={2}>Leg {index + 1}</Badge>
                            <Text><strong>Start:</strong> {leg.startAddress}</Text>
                            <Text><strong>End:</strong> {leg.endAddress}</Text>
                            <Text>Distance: {leg.distance}</Text>
                            <Text>Duration: {leg.duration}</Text>
                        </Box>
                    ))}
                    <Divider my={0} />
                    <Box bg="gray.50" p={4} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontWeight="bold">Total Distance: {routeData.totalDistance}</Text>
                        <Text fontWeight="bold">Total Duration: {routeData.totalDuration}</Text>
                        {googleMapsLink && (
                            <Button colorScheme="blue" onClick={openGoogleMaps} mt={4}>
                                Open in Google Maps
                            </Button>
                        )}
                    </Box>
                </VStack>
            </Box>
        </Container>
    );
}
