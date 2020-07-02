import React, { useState, useEffect, useRef } from 'react';
import Grid from './components/Grid';
import MazeControls from './components/MazeControls';
import { FaGithubAlt } from 'react-icons/fa';
import './App.css';
import MazeCreator from './Algorithms/MazeCreator';
import Dijkstra from './Algorithms/Dijkstra';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResizeObserver from 'resize-observer-polyfill';

const SLEEP_TIME = 60;
const mazeMemo = [];
let colCells;
let rowCells;

const INITIAL_CONTROLS = {
    setInitial: false,
    setWall: false,
    setFinal: false,
    setClear: false,
};

const INITIAL_CELL_CONF = {
    visited: false,
    isWall: false,
    isInitialCell: false,
    isFinalCell: false,
    isBacktrack: false,
    parent: null,
    weight: 0,
    animate: false,
};

const sleep = (time) => new Promise((res) => setTimeout(res, time));

const App = () => {
    const [cellHeight] = useState(20);
    const [cellWidth] = useState(20);
    const [indexInitialCell, setIndexInitialCell] = useState([]);
    const [indexFinalCell, setIndexFinalCell] = useState([]);
    const [maze, setMaze] = useState([]);
    const [controls, setControls] = useState({
        ...INITIAL_CONTROLS,
        setInitial: true,
    });
    const [isExecuting, setIsExecuting] = useState(false);
    const [message, setMessage] = useState('Initial cells selected');
    const [creatingMaze, setCreatingMaze] = useState(false);
    const refWrapGrid = useRef();
    const gridRef = useRef();

    useEffect(() => {
        const { height, width } = refWrapGrid.current.getBoundingClientRect();
        rowCells = parseInt((height / cellWidth) * 0.9);
        if (rowCells % 2 == 0) rowCells--;
        colCells = parseInt((width / cellHeight) * 0.9);
        if (colCells % 2 == 0) colCells--;
        initMaze();
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries, observer) => {
            const { width, height } = entries[0].contentRect;
            // gridRef.current.resize(Math.min(Math.min(width * 0.9, height * 0.9) / rowCells	));
        });
        observer.observe(refWrapGrid.current);

        return () => observer.unobserve(refWrapGrid.current);
    }, []);

    const initMaze = () => {
        console.log('init maze...');
        const initialMaze = [];
        for (let i = 0; i < rowCells; i++) {
            initialMaze[i] = [];
            mazeMemo[i]    = [];
            for (let j = 0; j < colCells; j++) {
                mazeMemo[i].push({ ...INITIAL_CELL_CONF, cordinates: [i, j] });
                initialMaze[i].push({ ...INITIAL_CELL_CONF, cordinates: [i, j] });
            }
        }
        console.log(mazeMemo);
        setMaze([...initialMaze]);
    };

    const createMazeDfs = async () => {
        if (creatingMaze) {
            toast.error('You already start a maze creation!');
            return;
        }
        setCreatingMaze(true);
        clearGrid();
        const creator = new MazeCreator(mazeMemo);

        console.log(mazeMemo);
        const path = creator.makeMazeDfs();
        await animatePath(path, 10);
        toast.success('🚀 Maze created!');
        setCreatingMaze(false);
    };

    const createMazeBacktracking = async () => {
        if (creatingMaze) {
            toast.error('You already start a maze creation!');
            return;
        }

        clearGrid();
        setCreatingMaze(true);
        const creator = new MazeCreator(mazeMemo);
        const path = creator.makeMazeBacktracking();
        await animatePath(path, SLEEP_TIME);
        toast.success('🚀 Maze created!');
        setCreatingMaze(false);
    };

    const startDijkstra = async () => {
        if (!indexInitialCell.length || !indexFinalCell.length) {
            toast.error(
                `Can not start dijkstra without initial and final cells not being established!
				Please set them and try again.`,
            );
            return;
        }

        toast.info('Starting dikjstra algorithm...');
        setIsExecuting(true);

        const { path, found } = new Dijkstra(mazeMemo).start(
            indexInitialCell,
            indexFinalCell,
        );
        await animatePath(path, SLEEP_TIME);
        if (found) toast.success('🚀 The maze has been resolved!');
        else toast.error('The maze has not been resolved!');
        setIsExecuting(false);
    };

    const animatePath = async (path, timeSleep = SLEEP_TIME) => {
        while (path.length !== 0) {
            const { i, j, event, fastSleep, current } = path.dequeue();
            if (event === 'visited') {
                maze[i][j].visited = true;
            } else if (event === 'backtrack') {
                maze[i][j].isBacktrack = true;
            } else if (event === 'wall') {
                maze[i][j].isWall = true;
            } else if (event === 'open') {
                maze[i][j].isWall = false;
            }

            maze[i][j].current = current;
            setMaze([...maze]);
            if (!fastSleep) await sleep(timeSleep);
        }
    };

    const clearGrid = () => {
        if (isExecuting || creatingMaze) {
            toast.error('Can not do this right now.');
            return;
        }

        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
                maze[i][j] = { ...INITIAL_CELL_CONF };
                mazeMemo[i][j] = { ...INITIAL_CELL_CONF };
            }
        }

        setIndexInitialCell([]);
        setIndexFinalCell([]);
        setMaze([...maze]);
    };

    const handleControls = (typeControl) => {
        switch (typeControl) {
            case 'initial': {
                setControls({ ...INITIAL_CONTROLS, setInitial: true });
                setMessage('Initial cells selected');
                break;
            }
            case 'final': {
                setControls({ ...INITIAL_CONTROLS, setFinal: true });
                setMessage('Final cells selected');
                break;
            }
            case 'wall': {
                setControls({ ...INITIAL_CONTROLS, setWall: true });
                setMessage('Wall cells selected');
                break;
            }
            case 'clear': {
                setControls({ ...INITIAL_CONTROLS, setClear: true });
                setMessage('Clear cells selected');
                break;
            }
        }
    };

    const handleClickCell = (i, j) => {
        if (isExecuting || creatingMaze) return;

        let confCell = maze[i][j];

        if (controls.setWall) {
            confCell = { ...INITIAL_CELL_CONF, ...confCell };
            confCell.isWall = true;
        } else if (controls.setInitial) {
            confCell = handleInitialCell(confCell, i, j);
        } else if (controls.setFinal) {
            confCell = handleFinalCell(confCell, i, j);
        } else if (controls.setClear) {
            confCell = { ...INITIAL_CELL_CONF, ...confCell };
        }

        confCell.animate = true;
        mazeMemo[i][j] = { ...confCell };
        maze[i][j] = { ...confCell };
        setMaze([...maze]);
    };

    const handleInitialCell = (confCell, i, j) => {
        if (indexInitialCell.length) {
            const [row, col] = indexInitialCell;
            maze[row][col] = { ...maze[row][col], ...INITIAL_CELL_CONF  };
        }

        confCell = { ...INITIAL_CELL_CONF, ...confCell };
        confCell.isInitialCell = true;
        confCell.animate = true;

        setIndexInitialCell([i, j]);
        return confCell;
    };

    const handleFinalCell = (confCell, i, j) => {
        if (indexFinalCell.length) {
            const [row, col] = indexFinalCell;
            console.log(row, col)
            maze[row][col] = { ...maze[row][col], ...INITIAL_CELL_CONF  };
        }

        confCell = { ...INITIAL_CELL_CONF };
        confCell.isFinalCell = true;
        confCell.animate = true;
        setIndexFinalCell([i, j]);
        return confCell;
    };

    return (
        <div className="app">
            <div className="wrap-githubIcon">
                <a
                    href="https://github.com/MiYazJE/PathfindingViewer/"
                    target="_blank"
                    alt="github repository of this proyect"
                    title="See the code!"
                >
                    <FaGithubAlt />
                </a>
            </div>
            <MazeControls
                createMazeDfs={createMazeDfs}
                createMazeBacktracking={createMazeBacktracking}
                clearGrid={clearGrid}
                startDijkstra={startDijkstra}
                onClick={handleControls}
                message={message}
            />
            <div className="wrap-grid" ref={refWrapGrid}>
                {maze.length && (
                    <Grid
                        ref={gridRef}
                        onClick={handleClickCell}
                        maze={maze}
                        rowCells={rowCells}
                        colCells={colCells}
                        cellWidth={cellWidth}
                        cellHeight={cellHeight}
                    />
                )}
            </div>
            <ToastContainer
                style={{ fontSize: '15px' }}
                position="bottom-right"
            />
        </div>
    );
};

export default App;
