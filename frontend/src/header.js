import React from 'react';
import { Box, Flex, Spacer, } from '@chakra-ui/react';

export function Header() {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="white"
            color="black"
            height="5vh"
        >
            <h1 fontSize="lg" fontWeight="bold">
                Pathfinder
            </h1>

            <Spacer />

            <Box display={{ base: 'none', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
            </Box>
        </Flex>
    );
}