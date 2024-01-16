import React from 'react';
import { useLocation } from 'react-router-dom';
import RouteDisplay from './RouteDisplay';

const ResultPage = () => {
    const location = useLocation();
    const { routeData } = location.state;

    return (
        <div>
            <RouteDisplay routeData={routeData} />
        </div>
    );
};

export default ResultPage;
