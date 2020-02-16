import React, { Component } from 'react';

export class MazeControls extends Component {

    render() {
        const { onClick, startDijkstra } = this.props;
        return (
            <div className="MazeControls">
                <button onClick={() => onClick('initial')}>
                    Initial Cell
                </button>
                <button onClick={() => onClick('final')}>
                    Final Cell
                </button>
                <button onClick={() => onClick('wall')}>
                    Wall Cells
                </button>
                <button onClick={() => onClick('clear')}>
                    Clear Cells
                </button>
                <button onClick={startDijkstra}>
                    Start Dikjstra
                </button>
            </div>
        );
    }
}

export default MazeControls;
