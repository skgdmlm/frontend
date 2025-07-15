import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader: React.FC<{ variableHeight?: boolean }> = ({ variableHeight = true }) => {
    return (
        <div
            className={`w-full flex justify-center items-center ${variableHeight ? 'h-screen' : ''}`}
        >
            <CircularProgress />
        </div>
    );
};

export default Loader;

