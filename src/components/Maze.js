import React from 'react';
import Cell from './Cell';

const Maze = ({ maze, handleClickCell, handleMouseMove, handleMouseUp }) => {

    return maze.map((row) =>
            row.map((cell) => (
                <Cell
                    key={cell.index}
                    {...cell}
                    onClick={handleClickCell}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
            )),
        )

} 

export default Maze;