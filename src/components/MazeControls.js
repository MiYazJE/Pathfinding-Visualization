import React from 'react';
import TextTransition from 'react-text-transition';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CELL_TYPES } from '../config';
import useControls from '../hooks/useControls';

const MazeControls = ({
    startDijkstra,
    clearGrid,
    createMazeDfs,
    createMazeBacktracking,
    startAstart,
    clearAll,
    setCellTypeSelected
}) => {

    const { message, changeControls } = useControls();

    const handleChangeControls = (cellType) => {
        setCellTypeSelected(cellType);
        changeControls(cellType);
    }

    const menuMazeGenerator = (
        <Menu>
            <Menu.Item className="btnControls" onClick={createMazeDfs} key="1">
                Random
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={createMazeBacktracking}
                key="2"
            >
                Backtracking
            </Menu.Item>
        </Menu>
    );

    const menuMazeControls = (
        <Menu>
            <Menu.Item
                className="btnControls"
                onClick={() => handleChangeControls(CELL_TYPES.INITIAL)}
                key="1"
            >
                Set initial
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => handleChangeControls(CELL_TYPES.FINAL)}
                key="2"
            >
                Set final
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => handleChangeControls(CELL_TYPES.WALL)}
                key="3"
            >
                Set wall
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => handleChangeControls(CELL_TYPES.OPEN)}
                key="4"
            >
                Set clear
            </Menu.Item>
            <Menu.Item className="btnControls" onClick={clearGrid} key="5">
                Clear grid
            </Menu.Item>
            <Menu.Item className="btnControls" onClick={clearAll} key="6">
                Clear all
            </Menu.Item>
        </Menu>
    );

    const menuPathfinding = () => (
        <Menu>
            <Menu.Item className="btnDijkstra" onClick={startDijkstra} key="1">
                Dijkstra
            </Menu.Item>
            <Menu.Item
                className="btnDijkstra"
                onClick={startAstart}
                key="2"
            >
                A-star
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="MazeControls">
            <div className="wrap-buttons">
                <Dropdown className="btnControls" overlay={menuMazeControls}>
                    <Button>
                        Maze Controls <DownOutlined />
                    </Button>
                </Dropdown>
                <Dropdown className="btnControls" overlay={menuMazeGenerator}>
                    <Button>
                        Maze Generator <DownOutlined />
                    </Button>
                </Dropdown>
                <Dropdown className="btnDijkstra" overlay={menuPathfinding}>
                    <Button className="btnDijkstra">
                        Start Pathfinding
                    </Button>
                </Dropdown>
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
