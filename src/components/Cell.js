import React, { Component } from 'react';


class Cell extends Component {

    getCellBackground = () => {
        const {visited, isWall, isInitialCell, isFinalCell} = this.props;
        if (visited)       return 'green';
        if (isWall)        return 'black';
        if (isInitialCell) return 'blue';
        if (isFinalCell)   return 'red';
        return 'white';
    }
    
    render() {
        const { onClick } = this.props;
        const backgroundColor = this.getCellBackground();
        return (
            <div
                style={{
                    backgroundColor: backgroundColor
                }}
                className="Cell"
                onClick={onClick}>
            </div>
        )
    }

} 

export default Cell;