import React, { useState } from 'react';
import Cell from './Cell';

const Grid = ({
    colCells,
    rowCells,
    maze,
    onClick,
    cellHeight,
    cellWidth
}) => {
    const [mouseDown, setMouseDown] = useState(false);

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

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: `repeat(${rowCells}, ${cellWidth}px)`,
                gridTemplateColumns: `repeat(${colCells}, ${cellHeight}px)`,
            }}
            className="Grid"
        >
            {maze && createGridComponent()}
        </div>
    );
};

export default Grid;
