import { useState } from 'react';
import { CONTROLS_MESSAGES } from '../config';

const useControls = () => {
    const [message, setMessage] = useState('Initial cells selected');

    const changeControls = (cellType) => {
        setMessage(CONTROLS_MESSAGES[cellType]);
    };

    return { message, setMessage, changeControls };
}

export default useControls;
