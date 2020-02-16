import React, { Component } from 'react';


class Cell extends Component {

    getClassName = () => {
        const { visited, isWall, isInitialCell, isFinalCell, isCamino } = this.props;
        if (isCamino) return 'camino';
        if (visited) return 'visited';
        if (isWall) return 'wall';
        if (isInitialCell) return 'initialCell';
        if (isFinalCell) return 'finalCell';
        return '';
    }

    render() {
        const { onClick, onMouseUp, onMouseMove, index } = this.props;
        const className = this.getClassName();
        return (
            <div
                className={`Cell ${className}`}
                onMouseDown={() => onClick(index)}
                onMouseUp={onMouseUp}
                onMouseMove={() => onMouseMove(index)}>
            </div>
        )
    }

}

export default Cell;