import React, { Component } from 'react';
import Grid from './components/Grid';
import MazeControls from './components/MazeControls';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state= {
			ROW_CELLS: 20,
			COL_CELLS: 20,
			showGrid: false,
			cellHeight: null,
			cellWidth: null,
			controls: {
				setWalls: false,
				setInitialCell: false,
				setFinalCell: false,
			},
		}
		this.refApp = React.createRef();
	}

	componentDidMount() {

		const { clientWidth, clientHeight } = this.refApp.current;

		this.setState({
			cellWidth: (clientWidth / this.state.ROW_CELLS),
			cellHeight: (clientHeight / this.state.COL_CELLS),
			showGrid: true
		})
	}

	handleControls = (typeControl) => {
		const controls = {
			setInitialCell: false,
			setFinalCell: false,
			setWalls: false
		} 
		switch (typeControl) {
			case 'initial': controls.setInitialCell = true; break;
			case 'final':   controls.setFinalCell   = true; break;
			case 'wall':    controls.setWalls       = true; break;
			default: break;
		}
		this.setState({ controls });
	}

	render() {
		const { controls, ROW_CELLS, COL_CELLS, cellWidth, cellHeight, showGrid } = this.state;
		return (
			<div ref={this.refApp} className="app">
				<MazeControls onClick={this.handleControls} />
				{showGrid && 
				<Grid 
					controls={controls}
					rowCells={ROW_CELLS} 
					colCells={COL_CELLS} 
					cellWidth={cellWidth} 
					cellHeight={cellHeight} 
				/>}
			</div>
		)
	}
}

export default App;