import React from 'react';
import { CELL_TYPES } from '../config';

const Cell = ({
    onClick,
    onMouseUp,
    onMouseMove,
    width,
    cellType,
    initial,
    final,
    cordinates
}) => {

    const getClassName = () => {
        if (cellType === CELL_TYPES.BACKTRACK) return 'backtrack';
        if (cellType === CELL_TYPES.WALL)      return 'wall';
        if (cellType === CELL_TYPES.VISITED)   return 'visited';
        if (cellType === CELL_TYPES.OPEN)      return 'white';
    };

    return (
        <div
            style={{ width, height: width }}
            className={`Cell ${!final && !initial ? getClassName() : null} ${initial ? 'initialCell' : final ? 'finalCell' : ''}`}
            onMouseDown={() => onClick(cordinates)}
            onMouseUp={onMouseUp}
            onMouseMove={() => onMouseMove(cordinates)}
        ></div>
    );
};

export default React.memo(Cell);