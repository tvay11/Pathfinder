import React from 'react';
import {
    Box,
    Text,
    VStack,
    Divider,
    Heading,
    Container
} from '@chakra-ui/react';



const RouteDisplay = ({ routeData }) => {
        if (!routeData || !routeData.legs) {
            return <Text></Text>;
        }

        return (
            <Container maxW="container.md">
                <Box
                    maxHeight="600px"
                    overflowY="scroll"
                    maxWidth="400px"
                    sx={{
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '-ms-overflow-style': 'none',
                        'scrollbarWidth': 'none',
                    }}
                >
                    <VStack spacing={5} align="stretch">
                        <Heading as="h6" size="md" style ={{marginTop:'3vh'}}>Route Details</Heading>
                        {routeData.legs.map((leg, index) => (
                            <Box key={index} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                                <Text fontWeight="bold">Leg {index + 1}</Text>
                                <Text>
                                    <span style={{ fontWeight: 'normal' }}>Start:</span>
                                    <span style={{ fontWeight: 'bold' }}> {leg.startAddress}</span>
                                </Text>
                                <Text>
                                    <span style={{ fontWeight: 'normal' }}>End:</span>
                                    <span style={{ fontWeight: 'bold' }}> {leg.endAddress}</span>
                                </Text>
                                <Text>Distance: {leg.distance}</Text>
                                <Text>Duration: {leg.duration}</Text>
                            </Box>
                        ))}

                        ))}
                        <Divider />
                        <Box p={4}>
                            <Text fontWeight="bold">Total Distance: {routeData.totalDistance}</Text>
                            <Text fontWeight="bold">Total Duration: {routeData.totalDuration}</Text>
                        </Box>
                    </VStack>
                </Box>
            </Container>
        );

    };

export default RouteDisplay;
