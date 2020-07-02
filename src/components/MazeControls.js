import React from 'react';
import TextTransition from 'react-text-transition';

const MazeControls = ({
    onClick,
    startDijkstra,
    clearGrid,
    message,
    createMazeDfs,
    createMazeBacktracking,
}) => {
    return (
        <div className="MazeControls">
            <div className="wrap-buttons">
                <button
                    className="btnControls"
                    onClick={() => onClick('initial')}
                >
                    Set Initial
                </button>
                <button
                    className="btnControls"
                    onClick={() => onClick('final')}
                >
                    Set Final
                </button>
                <button className="btnControls" onClick={() => onClick('wall')}>
                    Set Walls
                </button>
                <button
                    className="btnControls"
                    onClick={() => onClick('clear')}
                >
                    Clear cell
                </button>
                <button className="btnControls" onClick={clearGrid}>
                    Clear grid
                </button>
                <button className="btnControls" onClick={createMazeDfs}>
                    Create maze Random
                </button>
                <button
                    className="btnControls"
                    onClick={createMazeBacktracking}
                >
                    Create maze Backtracking
                </button>
                <button className="btnDijkstra" onClick={startDijkstra}>
                    Start Dikjstra
                </button>
            </div>
            <TextTransition
                className="controls-message"
                text={message}
                inline
                noOverflow={true}
            />
        </div>
    );
};

export default MazeControls;
