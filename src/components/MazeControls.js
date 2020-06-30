import React from 'react';

const MazeControls = ({ onClick, startDijkstra, clearGrid, message, errorMessage, createMazeDfs }) => {
    return (
        <div className="MazeControls">
            <div className="wrap-buttons">
                <button className="btnControls" onClick={() => onClick('initial')}>
                    Set Initial
                </button>
                <button className="btnControls" onClick={() => onClick('final')}>
                    Set Final
                </button>
                <button className="btnControls" onClick={() => onClick('wall')}>
                    Set Walls
                </button>
                <button className="btnControls" onClick={() => onClick('clear')}>
                    Clear cell
                </button>
                <button className="btnControls" onClick={clearGrid}>
                    Clear grid
                </button>
                <button className="btnControls" onClick={createMazeDfs}>
                    Create Maze
                </button>
                <button className="btnDijkstra" onClick={startDijkstra}>
                    Start Dikjstra
                </button>
            </div>
            <p className="controls-message">{message}</p>
            <p className={`${errorMessage ? ' error-message display' : 'hide'}`}>{errorMessage}</p>
        </div>
    );
};

export default MazeControls;
