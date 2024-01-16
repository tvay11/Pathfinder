import React, {useEffect} from 'react';
import {useLoadScript} from '@react-google-maps/api';
// import '@reach/combobox/styles.css';
import {ChakraProvider, Switch} from "@chakra-ui/react";
import {Places} from "./Places";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ResultPage from "./RoutePage";

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

    useEffect(() => {
        document.title = "Pathfinder";
    }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

    return (
        <Router>
            <ChakraProvider>
                <Routes>
                    <Route path="/" element={<Places />} />
                    <Route path="/Result" element={<ResultPage />} />
                </Routes>
            </ChakraProvider>
        </Router>
    );
}


export default App;

