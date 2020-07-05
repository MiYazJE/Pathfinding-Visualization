import React from 'react';
import CELL_TYPES from '../cellTypes';

const Cell = ({
    cellType,
    onClick,
    onMouseUp,
    onMouseMove,
    cordinates,
    width,
    initial,
    final
}) => {
    const getClassName = () => {
        if (cellType === CELL_TYPES.BACKTRACK) return 'backtrack';
        if (cellType === CELL_TYPES.WALL)      return 'wall';
        if (cellType === CELL_TYPES.VISITED)   return 'visited';
        if (cellType === CELL_TYPES.OPEN)      return 'white';
    };

    if (final || initial) console.log(cordinates, initial, final)
    return (
        <div
            style={{ width, height: width }}
            className={`Cell ${getClassName()} ${initial ? 'initialCell' : final ? 'finalCell' : ''}`}
            onMouseDown={() => onClick(cordinates)}
            onMouseUp={onMouseUp}
            onMouseMove={() => onMouseMove(cordinates)}
        ></div>
    );
};

export default Cell;
