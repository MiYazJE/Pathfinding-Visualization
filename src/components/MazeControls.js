import React, { Component } from 'react';

export class MazeControls extends Component {

    render() {
        const { onClick } = this.props;
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
            </div>
        );
    }
}

export default MazeControls;
