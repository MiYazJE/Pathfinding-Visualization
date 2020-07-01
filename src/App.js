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

let ROW_CELLS = 21;
let COL_CELLS = 21;
const SLEEP_TIME = 60;
const mazeMemo = [];

const INITIAL_CONTROLS = {
    setInitial: false,
    setWall: false,
    setFinal: false,
    setClear: false,
};

const sleep = (time) => new Promise((res) => setTimeout(res, time));

const App = () => {
    const [cellHeight, setCellHeight] = useState(null);
    const [cellWidth, setCellWidth] = useState(null);
    const [indexInitialCell, setIndexInitialCell] = useState(null);
    const [indexFinalCell, setIndexFinalCell] = useState(null);
    const [maze, setMaze] = useState([]);
    const [controls, setControls] = useState({ ...INITIAL_CONTROLS, setInitial: true });
    const [isExecuting, setIsExecuting] = useState(false);
    const [message, setMessage] = useState('Initial cells selected');
    const [creatingMaze, setCreatingMaze] = useState(false);
	const refWrapGrid = useRef();
	const gridRef = useRef();

    useEffect(() => {
		const { height, width } = refWrapGrid.current.getBoundingClientRect();
        setCellWidth(Math.min(width * 0.9, height * 0.9) / ROW_CELLS);
        setCellHeight(Math.min(width * 0.9, height * 0.9) / COL_CELLS);
        initMaze();
    }, []);

	useEffect(() => {
		const observer = new ResizeObserver((entries, observer) => {
			const { width, height } = entries[0].contentRect;
			gridRef.current.resize(Math.min(Math.min(width * 0.9, height * 0.9) / ROW_CELLS	));
        });
        observer.observe(refWrapGrid.current);

        return () => observer.unobserve(refWrapGrid.current);
	}, []);

    const initMaze = () => {
        const initialMaze = [];
        for (let i = 0; i < ROW_CELLS; i++) {
            mazeMemo.push(
                Array.from({ length: COL_CELLS }, (_, j) => {
                    const index = i * ROW_CELLS + j;
                    return getInitialCellConf(index);
                })
            );
            initialMaze.push(
                Array.from({ length: COL_CELLS }, (_, j) => {
                    const index = i * ROW_CELLS + j;
                    return getInitialCellConf(index);
                })
            );
        }
        setMaze([...initialMaze]);
    };

    const createMazeDfs = async () => {
        if (creatingMaze) {
            toast.error('You already start a maze creation!');
            return;
        }
        setCreatingMaze(true);
		clearGrid();
        const creator = new MazeCreator(mazeMemo, getRowAndColIndex);
        
		console.log(mazeMemo)
		const path = creator.makeMazeDfs();
		await animatePath(path, 10);
        toast.success('🚀 Maze created!');
        setCreatingMaze(false);
    };
    
    const createMazeBacktracking = async () => {
        if (creatingMaze) {
            toast.error('You already start a maze creation!');
            return
        }

        clearGrid();
        setCreatingMaze(true);
        const creator = new MazeCreator(mazeMemo);
        const path = creator.makeMazeBacktracking();
        await animatePath(path, SLEEP_TIME);
        toast.success('🚀 Maze created!');
        setCreatingMaze(false);
    }

    const startingDijkstra = async () => {
        if (indexInitialCell === null || indexFinalCell === null) {
            toast.error(
				`Can not start dijkstra without initial and final cells not being established!
				Please set them and try again.`,
            );
            return;
        }

		toast.info('Starting dikjstra algorithm...');
		setIsExecuting(true);

        const { path, found } = new Dijkstra(mazeMemo).start(indexInitialCell, indexFinalCell);
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
			}
			else if (event === 'wall') {
                maze[i][j].isWall = true;
            } else if (event === 'open') {
                maze[i][j].isWall = false;
            }

            // if () {

            // }
            setMaze([...maze]);
            if (!fastSleep) await sleep(timeSleep);
		}
	}

    const clearGrid = () => {
        if (isExecuting || creatingMaze) {
			toast.error('Can not do this right now.');
			return;
		} 

        for (let i = 0; i < maze.length; i++) {
            for (let j = 0; j < maze[i].length; j++) {
                maze[i][j] = getInitialCellConf(maze[i][j].index);
                mazeMemo[i][j] = getInitialCellConf(maze[i][j].index);
            }
        }

        setIndexInitialCell(null);
        setIndexFinalCell(null);
        setMaze([...maze]);
    };

    const getRowAndColIndex = (index) => {
        return [parseInt(index / ROW_CELLS), parseInt(index % COL_CELLS)];
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

    const getInitialCellConf = (index) => {
        return {
            index,
            visited: false,
            isWall: false,
            isInitialCell: false,
            isFinalCell: false,
            isBacktrack: false,
            parent: null,
            weight: 0,
            animate: false,
        };
    };

    const handleClickCell = (index) => {
        if (isExecuting || creatingMaze) return;

        const [i, j] = getRowAndColIndex(index);
        let confCell = maze[i][j];

        if (controls.setWall) {
            confCell = getInitialCellConf(index);
            confCell.isWall = true;
            confCell.animate = true;
        } else if (controls.setInitial) {
            confCell = handleInitialCell(confCell, index);
        } else if (controls.setFinal) {
            confCell = handleFinalCell(confCell, index);
        } else if (controls.setClear) {
            confCell = getInitialCellConf(index);
        }

        mazeMemo[i][j] = { ...confCell };
        maze[i][j] = { ...confCell };
        setMaze([...maze]);
    };

    const handleInitialCell = (confCell, index) => {
        // Remove previous initial cell if exists
        if (indexInitialCell != null) {
            const [row, col] = getRowAndColIndex(indexInitialCell);
            maze[row][col] = getInitialCellConf(indexInitialCell);
            maze[row][col].isInitialCell = false;
        }

        confCell = getInitialCellConf(index);
        confCell.isInitialCell = true;
        confCell.animate = true;

        setIndexInitialCell(index);
        return confCell;
    };

    const handleFinalCell = (confCell, index) => {
        // Remove previous final cell if exists
        if (indexFinalCell != null) {
            const [row, col] = getRowAndColIndex(indexFinalCell);
            maze[row][col] = getInitialCellConf(indexFinalCell);
            maze[row][col].isFinalCell = false;
        }

        confCell = getInitialCellConf(index);
        confCell.isFinalCell = true;
        confCell.animate = true;
        setIndexFinalCell(index);
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
                startDijkstra={startingDijkstra}
                onClick={handleControls}
                message={message}
            />
            <div className="wrap-grid" ref={refWrapGrid}>
                {maze.length && (
                    <Grid
						ref={gridRef}
                        onClick={handleClickCell}
                        maze={maze}
                        rowCells={ROW_CELLS}
                        colCells={COL_CELLS}
                        cellWidth={cellWidth}
                        cellHeight={cellHeight}
                        getInitialCellConf={getInitialCellConf}
                    />
                )}
            </div>
            <ToastContainer style={{fontSize: '15px'}} position="bottom-right" />
        </div>
    );
};

export default App;
