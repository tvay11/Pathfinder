import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {Box, Input, List, ListItem} from "@chakra-ui/react";
import React from "react";

export function PlacesAutocomplete({onSelect, label}) {
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