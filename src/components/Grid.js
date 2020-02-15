import React, { Component } from 'react';
import Cell from './Cell';

class Grid extends Component {

    createMaze() {

        const { colCells, rowCells, getInitialCellConf } = this.props;
        const maze = [];

        // Create first the maze where we gonna set the data as visited cells...
        for (let i = 0; i < rowCells; i++) {
            maze.push(
                Array.from({ length: colCells }, (_, j) => {
                    const index = (i * rowCells + j);
                    return getInitialCellConf(index);
                })
            )
        }

        this.setState({ maze })
    }

    

    createGridComponent = () => {
        const { cellHeight, cellWidth, colCells, rowCells } = this.props;
        const gridComponent = [];

        for (let i = 0; i < rowCells; i++) {
            gridComponent.push(
                Array.from({ length: colCells }, (_, j) => {
                    const index = (i * rowCells + j);
                    return (
                        <Cell
                            cellWidth={cellWidth}
                            cellHeight={cellHeight}
                            key={index}
                            visited={this.props.maze[i][j].visited}
                            isWall={this.props.maze[i][j].isWall}
                            isInitialCell={this.props.maze[i][j].isInitialCell}
                            isFinalCell={this.props.maze[i][j].isFinalCell}
                            isCamino={this.props.maze[i][j].isCamino}
                            onClick={() => this.props.onClick(index)}
                        />
                    )
                })
            )
        }

        return gridComponent;
    }

    render() {
        const { rowCells, colCells, cellHeight, cellWidth } = this.props;

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rowCells}, ${cellWidth}px)`,
                    gridTemplateColumns: `repeat(${colCells}, ${cellHeight}px)`,
                }}
                className="Grid"
            >
                {this.props.maze && this.createGridComponent()}
            </div>
        )
    }

}

export default Grid;