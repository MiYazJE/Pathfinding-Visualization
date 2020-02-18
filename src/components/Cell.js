import React, { Component } from 'react';


class Cell extends Component {

    getClassName = () => {
        const { visited, isWall, isInitialCell, isFinalCell, isCamino } = this.props;
        if (isInitialCell) return 'initialCell';
        if (isFinalCell) return 'finalCell';
        if (isCamino) return 'camino';
        if (isWall) return 'wall';
        if (visited) return 'visited';
        return 'white';
    }

    render() {
        const { onClick, onMouseUp, onMouseMove, index, animate } = this.props;
        const className = this.getClassName();
        return (
            <div
                className={`Cell ${className} ${animate ? 'cellStart' : ''}`}
                onMouseDown={() => onClick(index)}
                onMouseUp={onMouseUp}
                onMouseMove={() => onMouseMove(index)}>
            </div>
        )
    }

}

export default Cell;