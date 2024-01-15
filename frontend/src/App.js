import React, {useEffect} from 'react';
import {useLoadScript} from '@react-google-maps/api';
import '@reach/combobox/styles.css';
import {ChakraProvider} from "@chakra-ui/react";
import {Places} from "./Places";


function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
      <ChakraProvider >
        <Places />
      </ChakraProvider>
  );
}


export default App;

