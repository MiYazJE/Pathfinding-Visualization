import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import Cell from './Cell';

const Grid = forwardRef(({
    colCells,
    rowCells,
    maze,
    onClick,
    cellWidth
}, ref) => {
    const [mouseDown, setMouseDown] = useState(false);
    const [gridSize, setGridSize] = useState('');

    useEffect(() => {
        setGridSize(`repeat(${rowCells}, ${cellWidth}px)`);
    }, []);

    const createGridComponent = () => {
        const gridComponent = [];

        for (let i = 0; i < rowCells; i++) {
            gridComponent.push(
                Array.from({ length: colCells }, (_, j) => {
                    const index = i * rowCells + j;
                    return (
                        <Cell
                            key={index}
                            index={index}
                            {...maze[i][j]}
                            onClick={handleClickCell}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        />
                    );
                })
            );
        }

        return gridComponent;
    };

    const handleClickCell = (index) => {
        setMouseDown(true);
        onClick(index);
    };

    const handleMouseMove = (index) => {
        if (mouseDown) {
            onClick(index);
        }
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    useImperativeHandle(ref, () => ({
        resize: (size) => {
            setGridSize(`repeat(${rowCells}, ${size}px)`);
        }
    }));

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: gridSize,
                gridTemplateColumns: gridSize,
            }}
            className="Grid"
        >
            {maze && createGridComponent()}
        </div>
    );
});

export default Grid;
