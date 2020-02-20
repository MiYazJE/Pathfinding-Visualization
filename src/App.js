import React, { Component, createContext } from 'react';
import Grid from './components/Grid';
import MazeControls from './components/MazeControls';
import { FaGithubAlt } from 'react-icons/fa';
import './App.css';
import MazeCreator from './Algorithms/MazeCreator';
import Dijkstra from './Algorithms/Dijkstra';

const sleep = (time) => new Promise(res => setTimeout(res, time));

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ROW_CELLS: 21,
			COL_CELLS: 21,
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
			timeSleep: 60,
			isExecuting: false,
			message: 'Initial cells selected',
			errorMessage: null,
		}
		this.refWrapGrid = React.createRef();
	}

	updateMaze = async (maze) => {
		await this.setState({ maze });
	}

	createMazeDfs = () => {
		console.log('creating the maze with dfs...');

		this.clearGrid();
		const creator = new MazeCreator(
			this.state.maze, this.updateMaze, this.getRowAndColIndex 
		);

		creator.crearLaberinto();
	}

	startingDijkstra = async () => {
		const { indexFinalCell, indexInitialCell, maze, timeSleep } = this.state;

		if (this.state.indexInitialCell === null ||
			this.state.indexFinalCell === null) {
				this.setState({
					errorMessage: 'Can not start dijkstra without initial and final cells not being established! \nPlease set them and try again.'
				});
				setTimeout(() => this.setState({ errorMessage: null }), 10000);
				return;
			}
			

		this.setState({ 
			isExecuting: true,
			errorMessage: null
		});

		await new Dijkstra(maze, this.updateMaze).start(indexInitialCell, indexFinalCell, timeSleep);
		this.setState({ isExecuting: false })
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
		if (this.state.isExecuting) return;		

		const { maze } = this.state;

		for (let i = 0; i < maze.length; i++) {
			for (let j = 0; j < maze[i].length; j++) {
				maze[i][j] = this.getInitialCellConf(maze[i][j].index);
			}
		}

		this.setState({ 
			indexInitialCell: null,
			indexFinalCell: null,
			maze 
		});
	}

	componentDidMount() {

		const { clientHeight } = this.refWrapGrid.current;

		const maze = this.createMaze();

		this.setState({
			cellWidth: (clientHeight * 0.9 / this.state.ROW_CELLS),
			cellHeight: (clientHeight * 0.9 / this.state.COL_CELLS),
			showGrid: true,
			maze,
		})
	}

	getRowAndColIndex = (index) => {
		return [parseInt(index / this.state.ROW_CELLS), parseInt(index % this.state.COL_CELLS)];
	}

	handleControls = (typeControl) => {
		let message;
		const controls = {
			setInitial: false,
			setFinal: false,
			setWall: false,
			setClear: false,
		}
		switch (typeControl) {
			case 'initial': {
				controls.setInitial = true; 
				message = 'Initial cells selected';
				break;
			}
			case 'final': {
				controls.setFinal = true; 
				message = 'Final cells selected';
				break;
			}
			case 'wall': {
				controls.setWall = true; 
				message = 'Wall cells selected';
				break;
			}
			case 'clear': {
				controls.setClear = true; 
				message = 'Clear cells selected';
				break;
			}
			default: break;
		}
		this.setState({ 
			controls, 
			message,
		});
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
			animate: false,
			index
		}
	}

	handleClickCell = (index) => {
		if (this.state.isExecuting) return;

		const { controls, maze } = this.state;

		const [i, j] = this.getRowAndColIndex(index);
		let confCell = maze[i][j];

		if (controls.setWall) {
			confCell = this.getInitialCellConf(index);
			confCell.isWall = true;
			confCell.animate = true;
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
		confCell.animate = true;
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
		confCell.animate = true;
		this.setState({ indexFinalCell: index });
		return confCell;
	}

	render() {
		const { maze, ROW_CELLS, COL_CELLS, cellWidth, cellHeight, showGrid, message, errorMessage } = this.state;

		return (
			<div className="app">
				<div className="wrap-githubIcon">
					<a 
						href="https://github.com/MiYazJE/PathfindingViewer/"
						target="_blank"
						alt="github repository of this proyect"
						title="See the code!">
							<FaGithubAlt />
					</a>
				</div>
				<MazeControls 
					createMazeDfs={this.createMazeDfs}
					clearGrid={this.clearGrid}
					startDijkstra={this.startingDijkstra} 
					onClick={this.handleControls} 
					message={message}
					errorMessage={errorMessage}
				/>
				<div className="wrap-grid" ref={this.refWrapGrid}>
					{showGrid &&
						<Grid
							onClick={this.handleClickCell}
							maze={maze}
							rowCells={ROW_CELLS}
							colCells={COL_CELLS}
							cellWidth={cellWidth}
							cellHeight={cellHeight}
							getInitialCellConf={this.getInitialCellConf}
						/>
					}
				</div>
			</div>
		)
	}
}

export default App;