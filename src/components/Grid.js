import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useState,
} from 'react';
import Cell from './Cell';

const Grid = forwardRef(
    ({ colCells, rowCells, maze, onClick, cellWidth }, ref) => {
        const [mouseDown, setMouseDown] = useState(false);
        const [gridTemplateRows, setGridTemplateRows] = useState('');
        const [gridTemplateColumns, setGridTemplateColumns] = useState('');

        useEffect(() => {
            console.log(rowCells, colCells, cellWidth);
            setGridTemplateRows(
                `repeat(${parseInt(rowCells)}, ${cellWidth}px)`,
            );
            setGridTemplateColumns(
                `repeat(${parseInt(colCells)}, ${cellWidth}px)`,
            );
        }, []);

        const createGridComponent = () => {
            const gridComponent = [];
            for (let i = 0; i < rowCells; i++) {
                for (let j = 0; j < colCells; j++) {
                    const index = i * colCells + j;
                    gridComponent.push(
                        <Cell
                            key={index}
                            cordinates={[i, j]}
                            {...maze[i][j]}
                            onClick={handleClickCell}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        />,
                    );
                }
            }

            return gridComponent;
        };

        const handleClickCell = (cordinates) => {
            const [i, j] = cordinates;
            setMouseDown(true);
            onClick(i, j);
        };
        
        const handleMouseMove = (cordinates) => {
            const [i, j] = cordinates;
            if (mouseDown) {
                onClick(i, j);
            }
        };

        const handleMouseUp = () => {
            setMouseDown(false);
        };

        useImperativeHandle(ref, () => ({
            resize: (size) => {
                setGridTemplateRows(`repeat(${parseInt(rowCells)}, ${size}px)`);
                setGridTemplateColumns(
                    `repeat(${parseInt(colCells)}, ${size}px)`,
                );
            },
        }));

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: gridTemplateRows,
                    gridTemplateColumns: gridTemplateColumns,
                }}
                className="Grid"
            >
                {maze && createGridComponent()}
            </div>
        );
    },
);

export default Grid;
