import React, { Component } from 'react';
import Grid from './components/Grid';
import MazeControls from './components/MazeControls';
import './App.css';
const PriorityQueue = require('js-priority-queue');

class State {
	constructor(index, weight) {
		this.indexNode = index;
		this.weight = weight;
	}
}

const sleep = (time) => new Promise(res => setTimeout(res, time));

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ROW_CELLS: 20,
			COL_CELLS: 20,
			showGrid: false,
			cellHeight: null,
			cellWidth: null,
			maze: null, // this contains the data for the algorithm like visited cells, wall cells, initial and final ones
			indexInitialCell: null,
			indexFinalCell: null,
			controls: {
				setInitial: true,
				setWall: false,
				setFinal: false,
				setClear: false,
			},
			timeSleep: 100,
		}
		this.refApp = React.createRef();
	}

	dijkstra = async () => {
		if (!this.state.indexInitialCell === null ||
			!this.state.indexFinalCell === null)
			return;

		const { maze, indexInitialCell, indexFinalCell, ROW_CELLS, timeSleep } = this.state;

		const q = new PriorityQueue({
			comparator: (a, b) => a.weight - b.weight,
			strategy: PriorityQueue.ArrayStrategy
		});
		const distances = new Array(maze.length * maze[0].length).fill(Number.MAX_VALUE);
		q.queue(new State(indexInitialCell, 0));
		distances[indexInitialCell] = 0;

		let found = false;

		while (q.length !== 0) {

			let current = q.dequeue();

			if (current.indexNode === indexFinalCell) {
				found = true;
				break;
			}

			const [i, j] = this.getRowAndColIndex(current.indexNode);
			if (maze[i][j].visited || maze[i][j].isWall || current.weight > maze[i][j].weight)
				continue;

			maze[i][j].visited = true;
			this.setState({ maze })
			await sleep(timeSleep)

			for (let row = -1; row <= 1; row++) {
				for (let col = -1; col <= 1; col++) {
					if (Math.abs(row + col) !== 1) continue;

					let y = i + row;
					let x = j + col;

					if (y < 0 || x < 0 || y >= maze.length || x >= maze[0].length || maze[y][x].visited)
						continue;

					let potentialWeight = current.weight + maze[y][x].weight + 1;
					if (potentialWeight < distances[maze[y][x].index]) {
						let index = y * ROW_CELLS + x;
						q.queue(new State(index, potentialWeight));
						maze[y][x].weight = potentialWeight;
						maze[y][x].parent = maze[i][j];
						distances[maze[y][x].index] = potentialWeight;
					}

				}
			}

		}

		if (found) 
			this.printPath();
	}

	printPath = async () => {

		const {indexFinalCell, maze} = this.state;

		let currentIndex = indexFinalCell;

		while (true) {
			const [i, j] = this.getRowAndColIndex(currentIndex);
			maze[i][j].isCamino = true;
			this.setState({ maze });
			await sleep(this.state.timeSleep);
			if (maze[i][j].parent == null) break;
			currentIndex = maze[i][j].parent.index;
		}

	}

	createMaze = () => {
		const { COL_CELLS, ROW_CELLS } = this.state;
		const maze = [];

		for (let i = 0; i < ROW_CELLS; i++) {
			maze.push(
				Array.from({ length: COL_CELLS }, (_, j) => {
					const index = (i * ROW_CELLS + j);
					return this.getInitialCellConf(index);
				})
			)
		}

		return maze;
	}

	clearGrid = () => {
		
		const { maze } = this.state;

		for (let i = 0; i < maze.length; i++) {
			for (let j = 0; j < maze[i].length; j++) {
				maze[i][j] = this.getInitialCellConf(maze[i][j].index);
			}
		}

		this.setState({ maze });
	}

	componentDidMount() {

		const { clientWidth } = this.refApp.current;

		const maze = this.createMaze();

		this.setState({
			cellWidth: (clientWidth / this.state.ROW_CELLS),
			cellHeight: (clientWidth / this.state.COL_CELLS),
			showGrid: true,
			maze,
		})
	}

	getRowAndColIndex = (index) => {
		return [parseInt(index / this.state.ROW_CELLS), parseInt(index % this.state.COL_CELLS)];
	}

	handleControls = (typeControl) => {
		const controls = {
			setInitial: false,
			setFinal: false,
			setWall: false,
			setClear: false,
		}
		switch (typeControl) {
			case 'initial': controls.setInitial = true; break;
			case 'final': controls.setFinal = true; break;
			case 'wall': controls.setWall = true; break;
			case 'clear': controls.setClear = true; break;
			default: break;
		}
		this.setState({ controls });
	}

	getInitialCellConf = (index) => {
		return {
			visited: false,
			isWall: false,
			isInitialCell: false,
			isFinalCell: false,
			isCamino: false,
			parent: null,
			weight: 0,
			index
		}
	}

	handleClickCell = (index) => {

		const { controls, maze } = this.state;

		const [i, j] = this.getRowAndColIndex(index);
		let confCell = maze[i][j];

		if (controls.setWall) {
			confCell = this.getInitialCellConf(index);
			confCell.isWall = true;
		}
		else if (controls.setInitial) {
			confCell = this.handleInitialCell(confCell, index);
		}
		else if (controls.setFinal) {
			confCell = this.handleFinalCell(confCell, index);
		}
		else if (controls.setClear) {
			confCell = this.getInitialCellConf(index);
		}

		maze[i][j] = confCell;
		this.setState({ maze })
	}

	handleInitialCell = (confCell, index) => {
		const { indexInitialCell, maze } = this.state;

		// Remove previous initial cell if exists
		if (indexInitialCell != null) {
			const [row, col] = this.getRowAndColIndex(indexInitialCell);
			maze[row][col] = this.getInitialCellConf(indexInitialCell);
			maze[row][col].isInitialCell = false;
		}

		confCell = this.getInitialCellConf(index);
		confCell.isInitialCell = true;
		this.setState({ indexInitialCell: index });
		return confCell;
	}

	handleFinalCell = (confCell, index) => {
		const { indexFinalCell, maze } = this.state;

		// Remove previous final cell if exists
		if (indexFinalCell != null) {
			const [row, col] = this.getRowAndColIndex(indexFinalCell);
			maze[row][col] = this.getInitialCellConf(indexFinalCell);
			maze[row][col].isFinalCell = false;
		}

		confCell = this.getInitialCellConf(index);
		confCell.isFinalCell = true;
		this.setState({ indexFinalCell: index });
		return confCell;
	}

	render() {
		const { maze, ROW_CELLS, COL_CELLS, cellWidth, cellHeight, showGrid } = this.state;

		return (
			<div ref={this.refApp} className="app">
				<MazeControls clearGrid={this.clearGrid} startDijkstra={this.dijkstra} onClick={this.handleControls} />
				{showGrid &&
					<Grid
						onClick={this.handleClickCell}
						maze={maze}
						rowCells={ROW_CELLS}
						colCells={COL_CELLS}
						cellWidth={cellWidth}
						cellHeight={cellHeight}
						getInitialCellConf={this.getInitialCellConf}
					/>}
			</div>
		)
	}
}

export default App;