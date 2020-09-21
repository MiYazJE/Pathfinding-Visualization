import React, { useState } from 'react';

const Context = React.createContext({});

export const GridContextProvider = ({ children }) => {
    const [grid, setGrid] = useState([]);
    const [message, setMessage] = useState('Initial cells selected');
    const [cellTypeSelected, setCellTypeSelected] = useState('Initial cells selected');

    const changeMessage = (cellType) => {
        setCellTypeSelected(cellType);
        switch (cellType) {
            case CELL_TYPES.INITIAL: {
                setMessage('Initial cells selected');
                break;
            }
            case CELL_TYPES.FINAL: {
                setMessage('Final cells selected');
                break;
            }
            case CELL_TYPES.WALL: {
                setMessage('Wall cells selected');
                break;
            }
            case CELL_TYPES.OPEN: {
                setMessage('Clear cells selected');
                break;
            }
            default: break;
        }
    }

    const value = {
        grid, 
        setGrid, 
        message, 
        changeMessage,
        cellTypeSelected,
        setCellTypeSelected
    }

    return <Context.Provider value={value}>
        {children}
    </Context.Provider>
}

export default Context;