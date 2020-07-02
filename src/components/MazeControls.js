import React from 'react';
import TextTransition from 'react-text-transition';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

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
                onClick={() => changeControls('initial')}
                key="1"
            >
                Set initial
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => changeControls('final')}
                key="2"
            >
                Set final
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => changeControls('wall')}
                key="3"
            >
                Set wall
            </Menu.Item>
            <Menu.Item
                className="btnControls"
                onClick={() => changeControls('clear')}
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

                {/* <Button
                    className="btnControls"
                    onClick={() => onClick('initial')}
                >
                    Set Initial
                </Button>
                <Button
                    className="btnControls"
                    onClick={() => onClick('final')}
                >
                    Set Final
                </Button>
                <Button className="btnControls" onClick={() => onClick('wall')}>
                    Set Walls
                </Button>
                <Button
                    className="btnControls"
                    onClick={() => onClick('clear')}
                >
                    Clear cell
                </Button>
                <Button className="btnControls" onClick={clearGrid}>
                    Clear grid
                </Button> */}
                <Dropdown className="btnControls" overlay={menuMazeGenerator}>
                    <Button>
                        Maze Generator <DownOutlined />
                    </Button>
                </Dropdown>
                {/* <button className="btnControls" onClick={createMazeDfs}>
                    Create maze Random
                </button>
                <button
                    className="btnControls"
                    onClick={createMazeBacktracking}
                >
                    Create maze Backtracking
                </button> */}
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
