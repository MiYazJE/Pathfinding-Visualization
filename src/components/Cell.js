import React from 'react';

const Cell = ({
    visited,
    isWall,
    isBacktrack,
    isFinalCell,
    isInitialCell,
    onClick,
    onMouseUp,
    onMouseMove,
    cordinates,
    animate,
    current,
    width
}) => {
    const getClassName = () => {
        if (isInitialCell) return 'initialCell';
        if (isFinalCell)   return 'finalCell';
        if (isBacktrack)   return 'backtrack';
        if (isWall)        return 'wall';
        if (visited)       return 'visited';
        if (current)       return 'current';
        return 'white';
    };

    return (
        <div
            style={{ width, height: width }}
            className={`Cell ${getClassName()} ${animate ? 'cellStart' : ''}`}
            onMouseDown={() => onClick(cordinates)}
            onMouseUp={onMouseUp}
            onMouseMove={() => onMouseMove(cordinates)}
        ></div>
    );
};

export default Cell;
