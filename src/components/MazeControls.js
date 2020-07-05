import React from 'react';
import TextTransition from 'react-text-transition';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import CELL_TYPES from '../cellTypes';

const MazeControls = ({
    changeControls,
    startDijkstra,
    clearGrid,
    message,
    createMazeDfs,
    createMazeBacktracking,
}) => {
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
                onClick={() => changeControls(CELL_TYPES.INITIAL)}
                key="1"
            >
                Set initial
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => changeControls(CELL_TYPES.FINAL)}
                key="2"
            >
                Set final
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => changeControls(CELL_TYPES.WALL)}
                key="3"
            >
                Set wall
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => changeControls(CELL_TYPES.OPEN)}
                key="4"
            >
                Set clear
            </Menu.Item>
            <Menu.Item className="btnControls" onClick={clearGrid} key="5">
                Clear grid
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
                <Button className="btnDijkstra" onClick={startDijkstra}>
                    Start Dikjstra
                </Button>
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
