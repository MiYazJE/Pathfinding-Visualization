import React, { Component } from 'react';
import Cell from './Cell';

class Grid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gridComponent: null,
            maze: null, // this will contains the data for the algorithm like visited cells, wall cells...
            indexInitialCell: null,
            indexFinalCell: null,
        }
    }

    componentDidMount() {
        this.createMaze();
    }

    getInitialCellConf = (index) => {
        return {
            visited: false,
            isWall: false,
            isInitialCell: false,
            isFinalCell: false,
            index
        }
    }

    createMaze() {

        const { colCells, rowCells } = this.props;
        const maze = [];

        // Create first the maze where we gonna set the data as visited cells...
        for (let i = 0; i < rowCells; i++) {
            maze.push(
                Array.from({ length: colCells }, (_, j) => {
                    const index = (i * rowCells + j);
                    return this.getInitialCellConf(index);
                })
            )
        }

        this.setState({ maze })
    }

    handleClickCell = (index) => {

        const { rowCells, colCells, controls } = this.props;
        const { maze, indexFinalCell, indexInitialCell } = this.state;

        let i = parseInt(index / rowCells);
        let j = parseInt(index % colCells);
        let confCell = this.state.maze[i][j];

        if (controls.setWalls) {
            confCell = this.getInitialCellConf(index);
            confCell.isWall = true;
        } 
        else if (controls.setInitialCell) {
            // Remove previous initial cell if exists
            if (indexInitialCell != null) {
                const [row, col] = getRowAndColIndex(rowCells, colCells, indexInitialCell);
                maze[row][col] = this.getInitialCellConf(indexInitialCell);
                maze[row][col].isInitialCell = false;
            }
            confCell = this.getInitialCellConf(index);
            confCell.isInitialCell = true;
            this.setState({ indexInitialCell: index });
        } 
        else if (controls.setFinalCell) {
            // Remove previous final cell if exists
            if (indexFinalCell != null) {
                const [row, col] = getRowAndColIndex(rowCells, colCells, indexFinalCell);
                maze[row][col] = this.getInitialCellConf(indexFinalCell);
                maze[row][col].isFinalCell = false;
            }
            confCell = this.getInitialCellConf(index);
            confCell.isFinalCell = true;
            this.setState({ indexFinalCell: index });
        }

        maze[i][j] = confCell;
        this.setState({ maze })
    }

    getGridComponent = () => {
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
                            visited={this.state.maze[i][j].visited}
                            isWall={this.state.maze[i][j].isWall}
                            isInitialCell={this.state.maze[i][j].isInitialCell}
                            isFinalCell={this.state.maze[i][j].isFinalCell}
                            onClick={() => this.handleClickCell(index)}
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
                {this.state.maze && this.getGridComponent()}
            </div>
        )
    }

}

const getRowAndColIndex = (totalRowCells, totalColCells, index) => {
    return [parseInt(index / totalRowCells), parseInt(index % totalColCells)];
}

export default Grid;