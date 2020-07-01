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
    index,
    animate,
    current,
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
            className={`Cell ${getClassName()} ${animate ? 'cellStart' : ''}`}
            onMouseDown={() => onClick(index)}
            onMouseUp={onMouseUp}
            onMouseMove={() => onMouseMove(index)}
        ></div>
    );
};

export default Cell;
